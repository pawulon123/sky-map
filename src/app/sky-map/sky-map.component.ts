import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, effect, signal, computed } from '@angular/core';
// D3
import * as d3 from 'd3';
import * as d3geo from 'd3-geo';

/**
 * SkyMapComponent (Angular 18+, standalone)
 * -------------------------------------------------
 * - Pełna sfera niebieska 360°: stereograficzny, azymutalny równoodległościowy, równikowy (equirectangular)
 * - Warstwy: gwiazdy, granice IAU, siatka RA/DEC, etykiety gwiazd, nazwy gwiazdozbiorów
 * - Import JSON: katalog gwiazd + granice IAU
 * - Pobieranie domyślnych danych (HYG/BSC via d3-celestial CDN + granice IAU)
 * - Eksport: SVG i DXF (R12)
 *
 * Schemat danych wejściowych:
 *  Gwiazdy: { meta: { epoch: 'J2000' }, stars: [{ ra_deg:number|ra(h), dec:number, mag?:number, name?:string }] }
 *  Granice: { meta: { epoch: 'J2000' }, boundaries: [{ abbrev:string, name?:string, poly:[ [raDeg, dec], ... ], label?:{ra_deg:number, dec:number} }] }
 */

// Typy danych
interface Star { id?: number|string; ra?: number; ra_deg?: number; dec: number; mag?: number; name?: string; }
interface StarsData { meta?: any; stars: Star[]; }
interface Boundary { abbrev: string; name?: string; poly: [number, number][]; label?: { ra_deg: number; dec: number }; __projected?: [number, number][]; __labelProjected?: [number, number] | null; }
interface BoundariesData { meta?: any; boundaries: Boundary[]; }

// Demo minimalny
const DEMO_STARS: StarsData = {
  meta: { name: 'Demo Bright Stars', epoch: 'J2000' },
  stars: [
    { name: 'Sirius', ra_deg: 101.2875, dec: -16.7161, mag: -1.46 },
    { name: 'Canopus', ra_deg: 95.9879, dec: -52.6957, mag: -0.74 },
    { name: 'Arcturus', ra_deg: 213.9153, dec: 19.1824, mag: -0.05 },
    { name: 'Vega', ra_deg: 279.2347, dec: 38.7837, mag: 0.03 },
    { name: 'Capella', ra_deg: 79.1723, dec: 45.9979, mag: 0.08 },
    { name: 'Rigel', ra_deg: 78.6345, dec: -8.2016, mag: 0.12 },
    { name: 'Procyon', ra_deg: 114.8255, dec: 5.225, mag: 0.38 },
    { name: 'Betelgeuse', ra_deg: 88.7929, dec: 7.4071, mag: 0.5 },
  ]
};
const DEMO_BOUNDARIES: BoundariesData = {
  meta: { source: 'IAU', epoch: 'J2000' },
  boundaries: [
    { abbrev: 'ORI', name: 'Orion', poly: [[71,-1],[71,15],[98,15],[98,-1]], label: { ra_deg: 83.8, dec: 6.7 } },
    { abbrev: 'CRU', name: 'Crux', poly: [[180,-50],[190,-50],[190,-60],[180,-60]], label: { ra_deg: 186, dec: -57 } },
  ]
};

// Źródła domyślne
const D3C_BASE = 'https://cdn.jsdelivr.net/npm/d3-celestial@0.7.35/data';

async function fetchJSON<T=any>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

function geoLonToRaDeg(lon: number): number {
  const ra = (-lon) % 360; // konwencja d3-celestial: lon = -RA
  return (ra + 360) % 360;
}

async function loadDefaultStars(): Promise<StarsData> {
  const url = `${D3C_BASE}/stars.6.json`; // ~do mag 6
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
    } as Star;
  });
  return { meta: { name: 'd3-celestial stars.6.json', source: 'HYG/BSC via d3-celestial', epoch: 'J2000' }, stars };
}

async function loadDefaultBoundaries(): Promise<BoundariesData> {
  const url = `${D3C_BASE}/constellations.bounds.json`;
  const gj: any = await fetchJSON(url);
  const boundaries: Boundary[] = (gj.features || []).map((f: any) => {
    const name = f.properties?.name || f.properties?.n || f.properties?.abbr;
    const abbr = f.properties?.abbr || f.properties?.a || (name?.slice(0,3)?.toUpperCase());
    const segs = f.geometry?.type === 'MultiLineString' ? f.geometry.coordinates : (f.geometry?.type === 'LineString' ? [f.geometry.coordinates] : []);
    const poly = segs.flat().map(([lon, lat]: [number, number]) => [geoLonToRaDeg(lon), lat]) as [number,number][];
    const mid = poly[Math.floor(poly.length/2)] || [0,0];
    return { abbrev: abbr, name, poly, label: { ra_deg: mid[0], dec: mid[1] } } as Boundary;
  });
  return { meta: { source: 'IAU via d3-celestial', epoch: 'J2000' }, boundaries };
}

function raToDeg(s: Star): number | undefined {
  if (typeof s.ra_deg === 'number') return s.ra_deg;
  if (typeof s.ra === 'number') return s.ra * 15; // h -> deg
  return undefined;
}

function magToRadius(mag?: number, rMin = 0.2, rMax = 2.8): number {
  const clamped = Math.max(-1.5, Math.min(8, mag ?? 6));
  const t = (8 - (clamped + 1.5)) / 9.5; // jaśniejsze → większe
  return rMin + t * (rMax - rMin);
}

function toDXF(params: { width: number; height: number; stars: (Star & { __projected?: [number,number] })[]; boundaries: Boundary[]; showLabels: boolean; showConstellationLabels: boolean; showGrid: boolean; }): string {
  const { width, height, stars, boundaries, showLabels, showConstellationLabels } = params;
  const header = '0\nSECTION\n2\nENTITIES\n';
  const ents: string[] = [];

  // Granice
  boundaries?.forEach((b) => {
    const pts = b.__projected || [];
    for (let i=0; i<pts.length; i++) {
      const a = pts[i];
      const c = pts[(i+1)%pts.length];
      if (!a || !c || !isFinite(a[0]) || !isFinite(a[1]) || !isFinite(c[0]) || !isFinite(c[1])) continue;
      ents.push(`0\nLINE\n8\nBOUNDARY\n10\n${a[0]}\n20\n${height - a[1]}\n11\n${c[0]}\n21\n${height - c[1]}\n`);
    }
  });

  // Gwiazdy
  stars?.forEach((s) => {
    const p = (s as any).__projected as [number,number] | undefined;
    if (!p || !isFinite(p[0]) || !isFinite(p[1])) return;
    const r = magToRadius(s.mag);
    ents.push(`0\nCIRCLE\n8\nSTARS\n10\n${p[0]}\n20\n${height - p[1]}\n40\n${r}\n`);
    if (showLabels && s.name) {
      ents.push(`0\nTEXT\n8\nLABELS\n10\n${p[0] + r + 2}\n20\n${height - (p[1] + r + 2)}\n40\n2.5\n1\n${s.name}\n`);
    }
  });

  // Etykiety gwiazdozbiorów
  if (showConstellationLabels) {
    boundaries?.forEach((b) => {
      const p = b.__labelProjected as [number,number] | undefined;
      if (!p) return;
      ents.push(`0\nTEXT\n8\nCONS_LABELS\n10\n${p[0]}\n20\n${height - p[1]}\n40\n3.5\n1\n${b.name || b.abbrev}\n`);
    });
  }

  const footer = '0\nENDSEC\n0\nEOF\n';
  return header + ents.join('') + footer;
}

@Component({
  selector: 'app-sky-map',
  standalone: true,
  template: `
  <div class="p-4 grid gap-4 md:grid-cols-[320px_1fr]">
    <div class="space-y-4">
      <section class="border rounded-xl p-3">
        <h2 class="font-semibold text-lg mb-2">Rzut i wymiary</h2>
        <div class="grid grid-cols-3 gap-2 mb-3">
          <button class="btn" [class.active]="projectionName()==='stereographic'" (click)="projectionName.set('stereographic')">Stereograficzny</button>
          <button class="btn" [class.active]="projectionName()==='azimuthal'" (click)="projectionName.set('azimuthal')">Azymutalny</button>
          <button class="btn" [class.active]="projectionName()==='equirect'" (click)="projectionName.set('equirect')">Równikowy</button>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <label class="flex items-center gap-2">Szerokość
            <input type="number" class="input" [value]="width()" (input)="width.set($any($event.target).valueAsNumber)" />
          </label>
          <label class="flex items-center gap-2">Wysokość
            <input type="number" class="input" [value]="height()" (input)="height.set($any($event.target).valueAsNumber)" />
          </label>
        </div>
      </section>

      <section class="border rounded-xl p-3">
        <h2 class="font-semibold text-lg mb-2">Warstwy</h2>
        <label class="row"><input type="checkbox" [checked]="showStars()" (change)="showStars.set($any($event.target).checked)"> Gwiazdy</label>
        <label class="row"><input type="checkbox" [checked]="showBoundaries()" (change)="showBoundaries.set($any($event.target).checked)"> Granice IAU</label>
        <label class="row"><input type="checkbox" [checked]="showGrid()" (change)="showGrid.set($any($event.target).checked)"> Siatka RA/DEC</label>
        <label class="row"><input type="checkbox" [checked]="showStarLabels()" (change)="showStarLabels.set($any($event.target).checked)"> Etykiety gwiazd</label>
        <label class="row"><input type="checkbox" [checked]="showConstLabels()" (change)="showConstLabels.set($any($event.target).checked)"> Nazwy gwiazdozbiorów</label>
        <label class="row">Rozmiar etykiet
          <input type="range" min="8" max="24" step="1" [value]="labelSize()" (input)="labelSize.set($any($event.target).valueAsNumber)"> {{labelSize()}} px
        </label>
      </section>

      <section class="border rounded-xl p-3">
        <h2 class="font-semibold text-lg mb-2">Dane</h2>
        <button class="btn w-full" (click)="loadDefaults()">Załaduj domyślne (HYG + IAU)</button>
        <p class="muted">Źródło: d3-celestial CDN (stars.6.json, constellations.bounds.json)</p>
        <div class="mt-2 space-y-2">
          <label class="col">Wczytaj gwiazdy (JSON)
            <input type="file" accept="application/json" (change)="onImportJSON($event, 'stars')">
          </label>
          <label class="col">Wczytaj granice IAU (JSON)
            <input type="file" accept="application/json" (change)="onImportJSON($event, 'bounds')">
          </label>
        </div>
      </section>

      <div class="flex gap-2">
        <button class="btn" (click)="exportSVG()">Eksport SVG</button>
        <button class="btn" (click)="exportDXF()">Eksport DXF</button>
      </div>
    </div>

    <div class="border rounded-xl overflow-auto p-2">
      <svg #svgEl [attr.width]="width()" [attr.height]="height()">
        <rect [attr.width]="width()" [attr.height]="height()" fill="white"></rect>
        <path [attr.d]="spherePath()" fill="none" stroke="#222" [attr.stroke-width]="0.6"></path>

        <g *ngIf="showGrid()">
          <path [attr.d]="graticulePath()" fill="none" stroke="#bbb" [attr.stroke-width]="0.4"></path>
        </g>

        <g *ngIf="showBoundaries()">
          <ng-container *ngFor="let b of projectedBoundaries()">
            <path [attr.d]="linePath(b.__projected || [])" fill="none" stroke="#000" [attr.stroke-width]="0.6"></path>
          </ng-container>
        </g>

        <g *ngIf="showStars()">
          <ng-container *ngFor="let s of projectedStars()">
            <circle *ngIf="s.__projected" [attr.cx]="s.__projected![0]" [attr.cy]="s.__projected![1]" [attr.r]="starRadius(s)" fill="#000"></circle>
          </ng-container>
        </g>

        <g *ngIf="showStarLabels()" [attr.font-size]="labelSize()" font-family="ui-sans-serif, system-ui" fill="#000">
          <ng-container *ngFor="let s of projectedStars()">
            <text *ngIf="s.__projected && s.name" [attr.x]="s.__projected![0] + starRadius(s) + 2" [attr.y]="s.__projected![1] - starRadius(s) - 2">{{s.name}}</text>
          </ng-container>
        </g>

        <g *ngIf="showConstLabels()" [attr.font-size]="labelSize()" font-family="ui-sans-serif, system-ui" fill="#000">
          <ng-container *ngFor="let b of projectedBoundaries()">
            <text *ngIf="b.__labelProjected" [attr.x]="b.__labelProjected![0]" [attr.y]="b.__labelProjected![1]" text-anchor="middle">{{b.name || b.abbrev}}</text>
          </ng-container>
        </g>
      </svg>
    </div>
  </div>
  `,
  styles: [`
    .btn { @apply px-3 py-2 rounded-lg border text-sm; }
    .btn.active { @apply bg-black text-white; }
    .input { @apply w-full px-2 py-1 border rounded-lg; }
    .row { @apply flex items-center gap-2 py-1; }
    .col { @apply grid gap-1; }
    .muted { @apply text-xs text-gray-500; }
  `],
  imports:[CommonModule]
})
export class SkyMapComponent {
  @ViewChild('svgEl', { static: true }) svgEl!: ElementRef<SVGSVGElement>;

  // UI signals
  width = signal(1200);
  height = signal(1200);
  projectionName = signal<'stereographic'|'azimuthal'|'equirect'>('stereographic');

  showStars = signal(true);
  showBoundaries = signal(true);
  showGrid = signal(true);
  showStarLabels = signal(true);
  showConstLabels = signal(true);
  labelSize = signal(12);

  // Dane
  starsData = signal<StarsData>(DEMO_STARS);
  boundariesData = signal<BoundariesData>(DEMO_BOUNDARIES);

  // Projekcje i ścieżki
  projection = computed(() => {
    const w = this.width();
    const h = this.height();
    const cx = w/2, cy = h/2;
    let proj: d3geo.GeoProjection;
    switch (this.projectionName()) {
      case 'stereographic':
        proj = d3geo.geoStereographic();
        (proj as any).clipAngle(180);
        break;
      case 'azimuthal':
        proj = d3geo.geoAzimuthalEquidistant();
        (proj as any).clipAngle(180);
        break;
      default:
        proj = d3geo.geoEquirectangular();
        break;
    }
    (proj as any).translate([cx, cy]);
    if (this.projectionName() === 'equirect') {
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

  // Projekcja danych
  projectedStars = computed(() => {
    const proj = this.projection();
    return (this.starsData().stars || []).map((s) => {
      const ra = raToDeg(s);
      const dec = s.dec;
      if (ra == null || dec == null) return s as any;
      const lon = -ra; // RA -> -λ
      const lat = dec;
      const p = proj([lon, lat]) as [number, number];
      return { ...s, __projected: p } as Star & { __projected?: [number,number] };
    });
  });

  projectedBoundaries = computed(() => {
    const proj = this.projection();
    return (this.boundariesData().boundaries || []).map((b) => {
      const poly = (b.poly || []).map(([raDeg, dec]) => {
        const lon = -raDeg;
        const lat = dec;
        return proj([lon, lat]) as [number, number];
      });
      let labelP: [number, number] | null = null;
      if (b.label && typeof b.label.ra_deg === 'number' && typeof b.label.dec === 'number') {
        labelP = proj([-b.label.ra_deg, b.label.dec]) as [number, number];
      }
      return { ...b, __projected: poly, __labelProjected: labelP } as Boundary;
    });
  });

  linePath(pts: [number, number][]): string | undefined {
    return d3.line()(<[number,number][]>pts) || undefined;
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

  async onImportJSON(ev: Event, which: 'stars'|'bounds') {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const data = JSON.parse(text);
      if (which === 'stars') this.starsData.set(data as StarsData); else this.boundariesData.set(data as BoundariesData);
    } catch (e: any) {
      alert('Błąd parsowania JSON: ' + e.message);
    }
  }

  exportSVG() {
    const svg = this.svgEl?.nativeElement;
    if (!svg) return;
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);
    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www.w3.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mapa_nieba_${this.projectionName()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  exportDXF() {
    const stars = this.projectedStars() as (Star & { __projected?: [number,number] })[];
    const bounds = this.projectedBoundaries();
    const dxf = toDXF({
      width: this.width(),
      height: this.height(),
      stars,
      boundaries: bounds,
      showLabels: this.showStarLabels(),
      showConstellationLabels: this.showConstLabels(),
      showGrid: this.showGrid(),
    });
    const blob = new Blob([dxf], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mapa_nieba_${this.projectionName()}.dxf`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
