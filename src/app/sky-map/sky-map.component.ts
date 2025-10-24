import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, signal, computed, effect, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as d3geo from 'd3-geo';
type ProjectionName =
  | 'stereographic'
  | 'azimuthal'        // azimuthal equidistant
  | 'azimuthalEA'      // azimuthal equal-area
  | 'orthographic'
  | 'gnomonic'
  | 'mercator'
  | 'equirect';

interface Star {
  id?: number | string;
  ra?: number;
  ra_deg?: number;
  dec: number;
  mag?: number;
  name?: string;
  spect?: string | null;
  dist_pc?: number | null;
  __projected?: [number, number];
}
interface StarsData { meta?: any; stars: Star[]; }

interface Boundary {
  abbrev: string;
  name?: string;
  poly?: [number, number][];
  segments?: [number, number][][];
  label?: { ra_deg: number; dec: number };
  __projected?: [number, number][];
  __projectedSegments?: [number, number][][];
  __labelProjected?: [number, number] | null;
}
interface BoundariesData { meta?: any; boundaries: Boundary[]; }

const D3C_BASE = 'https://cdn.jsdelivr.net/npm/d3-celestial@0.7.35/data';
const ASSETS_STARS_JSON = 'hyg-stars.json'; // ← Twój plik JSON w /src/assets/…

async function fetchJSON<T = any>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}
function geoLonToRaDeg(lon: number): number {
  return (-lon + 360) % 360;
}


function raToDeg(s: Star): number | undefined {
  if (typeof s.ra_deg === 'number') return s.ra_deg;
  if (typeof s.ra === 'number') return s.ra * 15;
  return undefined;
}
function magToRadius(mag?: number, rMin = 0.2, rMax = 2.8): number {
  const clamped = Math.max(-1.5, Math.min(8, mag ?? 6));
  const t = (8 - (clamped + 1.5)) / 9.5;
  return rMin + t * (rMax - rMin);
}

/** --- STARS (domyślnie z d3-celestial; JSON z assets tylko dla etykiet) --- */
async function loadDefaultStars(): Promise<StarsData> {
  const url = `${D3C_BASE}/stars.6.json`;
  const gj: any = await fetchJSON(url);
  const stars: Star[] = (gj.features || []).map((f: any) => {
    const [lon, lat] = f.geometry?.coordinates || [];
    const p = f.properties || {};
    return {
      ra_deg: geoLonToRaDeg(lon),
      dec: lat,
      mag: typeof p.mag === 'number' ? p.mag : undefined,
      name: p.propername || p.name || undefined,
      id: p.hip || p.hd || undefined,
    };
  });
  return { meta: { name: 'd3-celestial stars.6.json', source: 'HYG/BSC via d3-celestial', epoch: 'J2000' }, stars };
}
async function loadFilteredStars(maxMag: number): Promise<StarsData> {
  const all = await loadDefaultStars();
  return {
    meta: { ...all.meta, name: `stars.6 ≤${maxMag}` },
    stars: all.stars.filter((s: Star) => s.mag !== undefined && s.mag <= maxMag),
  };
}
/** JSON z assets (ładowany tylko, gdy włączysz etykiety) */
async function loadStarsFromAssets(): Promise<StarsData> {
  const data = await fetchJSON<any>(ASSETS_STARS_JSON);
  // Obsłużamy dwa przypadki: {meta, stars:[...]} lub po prostu tablicę gwiazd
  if (Array.isArray(data)) {
    return { meta: { source: 'assets' }, stars: data as Star[] };
  }
  return { meta: data.meta ?? { source: 'assets' }, stars: data.stars as Star[] };
}

/** --- GRANICE / ASTERYZMY / LINIE --- */
async function loadDefaultBoundaries(): Promise<BoundariesData> {
  const url = `${D3C_BASE}/constellations.bounds.json`;
  const gj: any = await fetchJSON(url);
  const toRaDec = ([lon, lat]: [number, number]): [number, number] => [geoLonToRaDeg(lon), lat];

  const boundaries: Boundary[] = (gj.features || []).map((f: any) => {
    const name = f.properties?.name || f.properties?.n || f.properties?.abbr;
    const abbr = f.properties?.abbr || f.properties?.a || (name?.slice(0, 3)?.toUpperCase());
    const g = f.geometry || {};
    let segments: [number, number][][] = [];

    if (g.type === 'MultiLineString') {
      segments = (g.coordinates as [number, number][][]).map((seg: [number, number][]) => seg.map(toRaDec));
    } else if (g.type === 'LineString') {
      segments = [(g.coordinates as [number, number][]).map(toRaDec)];
    } else if (g.type === 'Polygon') {
      const rings = g.coordinates as [number, number][][];
      if (rings?.length) segments = [rings[0].map(toRaDec)];
    } else if (g.type === 'MultiPolygon') {
      const polys = g.coordinates as [number, number][][][];
      segments = polys.map((poly: [number, number][][]) => (poly?.[0] || []).map(toRaDec)).filter((seg: [number, number][]) => seg.length > 0);
    }

    const first = segments?.[0]?.[0] || [0, 0];
    return { abbrev: abbr, name, segments, label: { ra_deg: first[0], dec: first[1] } };
  });

  return { meta: { source: 'IAU via d3-celestial', epoch: 'J2000' }, boundaries };
}
async function loadDefaultAsterisms(): Promise<BoundariesData> {
  const url = `${D3C_BASE}/asterisms.json`;
  const gj: any = await fetchJSON(url);
  const toRaDec = ([lon, lat]: [number, number]): [number, number] => [geoLonToRaDeg(lon), lat];

  const boundaries: Boundary[] = (gj.features || []).map((f: any) => {
    const name = f.properties?.name || 'Asterism';
    const abbr = f.properties?.abbr || name.slice(0, 3).toUpperCase();
    const g = f.geometry || {};
    let segments: [number, number][][] = [];

    if (g.type === 'MultiLineString') {
      segments = (g.coordinates as [number, number][][]).map((seg: [number, number][]) => seg.map(toRaDec));
    } else if (g.type === 'LineString') {
      segments = [(g.coordinates as [number, number][]).map(toRaDec)];
    }

    const first = segments?.[0]?.[0] || [0, 0];
    return { abbrev: abbr, name, segments, label: { ra_deg: first[0], dec: first[1] } };
  });

  return { meta: { source: 'd3-celestial asterisms', epoch: 'J2000' }, boundaries };
}
async function loadConstellationLines(): Promise<BoundariesData> {
  const url = `${D3C_BASE}/constellations.lines.json`;
  const gj: any = await fetchJSON(url);
  const toRaDec = ([lon, lat]: [number, number]): [number, number] => [geoLonToRaDeg(lon), lat];

  const boundaries: Boundary[] = (gj.features || []).map((f: any) => {
    const name = f.properties?.name || f.properties?.n || f.properties?.abbr;
    const abbr = f.properties?.abbr || f.properties?.a || name?.slice(0, 3)?.toUpperCase();
    const g = f.geometry || {};
    let segments: [number, number][][] = [];

    if (g.type === 'MultiLineString') {
      segments = (g.coordinates as [number, number][][]).map((seg: [number, number][]) => seg.map(toRaDec));
    } else if (g.type === 'LineString') {
      segments = [(g.coordinates as [number, number][]).map(toRaDec)];
    }

    const first = segments?.[0]?.[0] || [0, 0];
    return { abbrev: abbr, name, segments, label: { ra_deg: first[0], dec: first[1] } };
  });

  return { meta: { source: 'd3-celestial constellation lines', epoch: 'J2000' }, boundaries };
}

function normLon(lonDeg: number): number {
  // zwraca w [-180, 180)
  return ((lonDeg + 180) % 360 + 360) % 360 - 180;
}

function lonForProj(projName: ProjectionName, raDeg: number): number {
  // u Ciebie RA już jest w „długości” zgodnej z projekcją (bez minusa).
  // Normalizujemy tylko dla rzutów z krawędziami pionowymi:
  const needsClamp = projName === 'equirect' || projName === 'mercator';
  return needsClamp ? normLon(raDeg) : raDeg;
}




function cutOnAntimeridian(
  lonlat: [number, number][],
  name: ProjectionName,
  seam = 180
): [number, number][][] {
  if (!isRectularMap(name)) return [lonlat];

  const segments: [number, number][][] = [];
  let cur: [number, number][] = [];
  if (lonlat.length === 0) return segments;

  const norm = (lon: number) => ((lon + 180) % 360 + 360) % 360 - 180;

  let prevLon = norm(lonlat[0][0]);
  cur.push([prevLon, lonlat[0][1]]);

  for (let i = 1; i < lonlat.length; i++) {
    const rawLon = lonlat[i][0];
    const dec = lonlat[i][1];
    const lon = norm(rawLon);

    const diff = lon - prevLon; // w zakresie (-360, 360)
    // Jeżeli „skok” > 180° – rozcinamy w tym miejscu.
    if (Math.abs(diff) > 180 - 1e-6) {
      // zakończ aktualny segment
      segments.push(cur);
      // zacznij nowy od bieżącego punktu
      cur = [[lon, dec]];
    } else {
      cur.push([lon, dec]);
    }
    prevLon = lon;
  }
  if (cur.length) segments.push(cur);
  return segments;
}

function projectSegments(
  segments: [number, number][][],
  proj: d3geo.GeoProjection
): [number, number][][] {
  return segments.map(seg =>
    seg
      .map(([lon, lat]) => proj([lon, lat]) as [number, number])
      .filter(p => Number.isFinite(p?.[0]) && Number.isFinite(p?.[1]))
  ).filter(seg => seg.length > 1);
}

function isRectularMap(name: ProjectionName) {
  return name === 'equirect' || name === 'mercator';
}
 




@Component({
  selector: 'app-sky-map',
  standalone: true,
  templateUrl: 'sky-map.component.html',
  styles: [`
    .btn { @apply px-3 py-2 rounded-lg border text-sm; }
    .btn.active { @apply bg-black text-white; }
    .input { @apply w-full px-2 py-1 border rounded-lg; }
    .row { @apply flex items-center gap-2 py-1; }
    .col { @apply grid gap-1; }
    .muted { @apply text-xs text-gray-500; }
  `],
  imports: [CommonModule]
})
export class SkyMapComponent implements OnInit {
  @ViewChild('svgEl', { static: true }) svgEl!: ElementRef<SVGSVGElement>;

  maxMag = signal<number>(2.5);
  width = signal(1200);
  height = signal(1200);
  projectionName = signal<ProjectionName>('stereographic');

  showStars = signal(true);
  showBoundaries = signal(true);
  showGrid = signal(true);
  showAsterisms = signal(true);
  showConstellationLines = signal(true);

  /** Nowy główny checkbox: Etykiety (dla gwiazd) */
  showLabels = signal(false);
  /** Pilnuje, żeby JSON z assets wczytać tylko raz przy włączeniu etykiet */
  private assetsStarsLoaded = signal(false);

  starsData = signal<StarsData>({ meta: {}, stars: [] });
  boundariesData = signal<BoundariesData>({ meta: {}, boundaries: [] });
  asterismsData = signal<BoundariesData>({ meta: {}, boundaries: [] });
  constellationLinesData = signal<BoundariesData>({ meta: {}, boundaries: [] });


private labelsEffect = effect(() => {
    if (this.showLabels() && !this.assetsStarsLoaded()) {
      this.loadStarsFromAssetsOnce();
    }
  });

projection = computed(() => {
  const w = this.width();
  const h = this.height();
  const cx = w / 2, cy = h / 2;

  let proj: d3geo.GeoProjection;

  switch (this.projectionName()) {
    case 'stereographic':
      proj = d3geo.geoStereographic();
      (proj as any).clipAngle(180);
      break;

    case 'azimuthal':      // Azimuthal Equidistant (jak wcześniej)
      proj = d3geo.geoAzimuthalEquidistant();
      (proj as any).clipAngle(180);
      break;

    case 'azimuthalEA':    // NOWE: Azimuthal Equal-Area
      proj = d3geo.geoAzimuthalEqualArea();
      (proj as any).clipAngle(180);
      break;

    case 'orthographic':   // NOWE
      proj = d3geo.geoOrthographic();
      (proj as any).clipAngle(90);
      break;

    case 'gnomonic':       // NOWE
      proj = d3geo.geoGnomonic();
      (proj as any).clipAngle(90);
      break;

    case 'mercator':       // NOWE
      proj = d3geo.geoMercator();
      break;

    default:               // 'equirect'
      proj = d3geo.geoEquirectangular();
      break;
  }

  (proj as any).translate([cx, cy]);

  if (this.projectionName() === 'equirect' || this.projectionName() === 'mercator') {
    (proj as any).fitExtent([[40, 40], [w - 40, h - 40]], { type: 'Sphere' });
  } else {
    const scale = Math.min(w, h) * 0.48;
    (proj as any).scale(scale);
  }

  return proj;
});



  path = computed(() => d3geo.geoPath(this.projection()));
  graticuleGen = d3geo.geoGraticule().step([15, 15]);
  spherePath = computed(() => this.path()({ type: 'Sphere' }) || undefined);
  graticulePath = computed(() => this.path()(this.graticuleGen()) || undefined);


projectedStars = computed(() => {
  const proj = this.projection();
  const name = this.projectionName();
  return (this.starsData().stars || []).map((s) => {
    const ra = raToDeg(s);
    const dec = s.dec;
    if (ra == null || dec == null) return s as any;
    const lon = lonForProj(name, ra);
    const p = proj([lon, dec]) as [number, number];
    return { ...s, __projected: p } as Star;
  });
});


projectedBoundaries = computed(() => {
  const proj = this.projection();
  const name = this.projectionName();

  return (this.boundariesData().boundaries || []).map((b) => {
    // segments (LineString/MultiLineString/Polygon->ring)
    let projectedSegments: [number, number][][] | undefined;
    if (b.segments?.length) {
      projectedSegments = b.segments.flatMap(seg => {
        const lonlat = seg.map(([raDeg, dec]) => [raDeg, dec] as [number, number]);
        const cut = cutOnAntimeridian(lonlat, name);
        return projectSegments(cut, proj);
      });
    }

    // poly (legacy)
    let projectedPoly: [number, number][] | undefined;
    if (b.poly?.length) {
      const lonlat = b.poly.map(([raDeg, dec]) => [raDeg, dec] as [number, number]);
      const cut = cutOnAntimeridian(lonlat, name);
      const projCuts = projectSegments(cut, proj);
      // dla „poly” zachowujemy 1 segment (jeśli jest ich więcej, i tak rysujesz każdy osobno poniżej)
      // więc przerzućmy to do __projectedSegments i wyczyść __projected
      projectedSegments = (projectedSegments || []).concat(projCuts);
      projectedPoly = undefined;
    }

    let labelP: [number, number] | null = null;
    if (b.label && typeof b.label.ra_deg === 'number' && typeof b.label.dec === 'number') {
      // label też respektuje seam
      const labelLon = ((b.label.ra_deg + 180) % 360 + 360) % 360 - 180;
      labelP = proj([labelLon, b.label.dec]) as [number, number];
    }

    return {
      ...b,
      __projected: projectedPoly,
      __projectedSegments: projectedSegments,
      __labelProjected: labelP
    } as Boundary;
  });
});




projectedConstellationLines = computed(() => {
  const proj = this.projection();
  const name = this.projectionName();
  return (this.constellationLinesData().boundaries || []).map(b => {
    const projectedSegments = b.segments?.flatMap(seg => {
      const lonlat = seg.map(([raDeg, dec]) => [raDeg, dec] as [number, number]);
      const cut = cutOnAntimeridian(lonlat, name);
      return projectSegments(cut, proj);
    });

    let labelP: [number, number] | null = null;
    if (b.label) {
      const llon = ((b.label.ra_deg + 180) % 360 + 360) % 360 - 180;
      labelP = proj([llon, b.label.dec]) as [number, number];
    }
    return { ...b, __projectedSegments: projectedSegments, __labelProjected: labelP } as Boundary;
  });
});



projectedAsterisms = computed(() => {
  const proj = this.projection();
  const name = this.projectionName();
  return (this.asterismsData().boundaries || []).map((b) => {
    const projectedSegments = b.segments?.flatMap(seg => {
      const lonlat = seg.map(([raDeg, dec]) => [raDeg, dec] as [number, number]);
      const cut = cutOnAntimeridian(lonlat, name);
      return projectSegments(cut, proj);
    });

    let labelP: [number, number] | null = null;
    if (b.label) {
      const llon = ((b.label.ra_deg + 180) % 360 + 360) % 360 - 180;
      labelP = proj([llon, b.label.dec]) as [number, number];
    }
    return { ...b, __projectedSegments: projectedSegments, __labelProjected: labelP } as Boundary;
  });
});


  ngOnInit(): void {
    this.loadDefaults();

    /** Reakcja na kliknięcie checkboxa „Etykiety”:
     *  przy pierwszym włączeniu dociągnij gwiazdy z assets (jeśli jeszcze nie były). */

  }

  async loadStarsFromAssetsOnce() {
    try {
      const stars = await loadStarsFromAssets();
      this.starsData.set(stars);
      this.assetsStarsLoaded.set(true);
    } catch (e: any) {
      console.error('Błąd pobierania JSON z assets:', e?.message || e);
    }
  }

  labelX(s: Star): number {
  const p = s.__projected!;
  return this.width() - p[0];        // lustrzane odbicie względem osi pionowej
}
labelY(s: Star): number {
  const p = s.__projected!;
  return p[1] - (this.starRadius(s) + 2);  // jak było – nad gwiazdą
}


  async loadAsterisms() {
    try {
      const data = await loadDefaultAsterisms();
      this.asterismsData.set(data);
    } catch (e: any) {
      alert('Błąd pobierania asteryzmów: ' + e.message);
    }
  }
  async loadConstellationLinesClick() {
    try {
      const data = await loadConstellationLines();
      this.constellationLinesData.set(data);
    } catch (e: any) {
      alert('Błąd pobierania linii gwiazdozbiorów: ' + e.message);
    }
  }

  async loadByMag() {
    try {
      const stars = await loadFilteredStars(this.maxMag());
      this.starsData.set(stars);
      // uwaga: jeśli wcześniej wczytałeś dane z assets, ten przycisk nadpisze je danymi z d3-celestial
      // (tak zostawiamy na razie prosto; można to później ujednolicić)
    } catch (e: any) {
      alert('Błąd pobierania gwiazd: ' + e.message);
    }
  }

  linePath(pts: [number, number][]): string | undefined {
    return d3.line()(<[number, number][]>pts) || undefined;
  }
  starRadius(s: Star): number { return magToRadius(s.mag); }

  async loadDefaults() {
    try {
      const [stars, bounds] = await Promise.all([loadDefaultStars(), loadDefaultBoundaries()]);
      this.starsData.set(stars);
      this.boundariesData.set(bounds);
    } catch (e: any) {
      alert('Błąd pobierania danych domyślnych: ' + e.message);
    }
  }

  exportSVG() {
    const svg = this.svgEl?.nativeElement;
    if (!svg) return;
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);
    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg">');
    }
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mapa_nieba_${this.projectionName()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  exportDXF() {}

  /** Handler do checkboxa w HTML (opcjonalny, ale czytelny) */
  toggleLabels(checked: boolean) {
    this.showLabels.set(checked);
  }
}
