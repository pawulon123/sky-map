import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Boundary {
  abbrev: string;
  name?: string;
  segments: [number, number][][];   // [[ [ra°,dec], ... ], ...]
  label?: { ra_deg: number; dec: number } | null;
}
export interface BoundariesData { meta?: any; boundaries: Boundary[]; }

const D3C_BASE = 'https://cdn.jsdelivr.net/npm/d3-celestial@0.7.35/data';

@Injectable({ providedIn: 'root' })
export class BoundariesService {
  private platformId = inject(PLATFORM_ID);

  private _loaded = signal(false);
  loaded = this._loaded.asReadonly();

  private _data = signal<BoundariesData>({ meta: {}, boundaries: [] });
  data = this._data.asReadonly();

private lonToRa(lon: number) {
  // normalizuj lon do [0,360)
  // bez negacji -lon
  const ra = ((lon % 360) + 360) % 360;
  return ra;
}



private featureToSegments(feat: any): [number, number][][] {
  const g = feat?.geometry || {};

  // teraz toRaDec NIE odwraca znaku
  const toRaDec = ([lon, lat]: [number, number]) =>
    [this.lonToRa(lon), lat] as [number, number];

  if (g.type === 'LineString') {
    return [ (g.coordinates as [number,number][]) .map(toRaDec) ];
  }

  if (g.type === 'MultiLineString') {
    return (g.coordinates as [number,number][][])
      .map(seg => seg.map(toRaDec));
  }

  if (g.type === 'Polygon') {
    return (g.coordinates?.[0]?.length
      ? [ g.coordinates[0].map(toRaDec) ]
      : []
    );
  }

  if (g.type === 'MultiPolygon') {
    const polys = g.coordinates as [number,number][][][];
    return polys
      .map(poly => (poly?.[0] || []).map(toRaDec))
      .filter(seg => seg.length);
  }

  return [];
}


  async loadOnce() {
    if (!isPlatformBrowser(this.platformId) || this._loaded()) return;

    const url = `${D3C_BASE}/constellations.bounds.json`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const gj = await res.json();

    const boundaries: Boundary[] = (gj.features || []).map((f: any) => {
      const p = f.properties || {};
      const name = p.name || p.n || p.abbr;
      const abbrev = p.abbr || p.a || (name?.slice(0,3)?.toUpperCase?.());
      const segments = this.featureToSegments(f);
      const first = segments?.[0]?.[0] || null;
      const label = first ? { ra_deg: first[0], dec: first[1] } : null;
      return { abbrev, name, segments, label };
    });

    this._data.set({ meta: { source: 'IAU via d3-celestial', epoch: 'J2000' }, boundaries });
    this._loaded.set(true);
  }
}
