import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Asterism {
  abbrev: string;
  name?: string;
  segments: [number, number][][];
  label?: { ra_deg: number; dec: number } | null;
}
export interface AsterismsData { meta?: any; items: Asterism[]; }

const D3C_BASE = 'https://cdn.jsdelivr.net/npm/d3-celestial@0.7.35/data';

@Injectable({ providedIn: 'root' })
export class AsterismsService {
  private platformId = inject(PLATFORM_ID);

  private _loaded = signal(false);
  loaded = this._loaded.asReadonly();

  private _data = signal<AsterismsData>({ meta: {}, items: [] });
  data = this._data.asReadonly();

  private lonToRa(lon: number) { return ((-lon % 360) + 360) % 360; }

  private featureToSegments(feat: any): [number, number][][] {
    const g = feat?.geometry || {};
    const toRaDec = ([lon, lat]: [number, number]) => [this.lonToRa(lon), lat] as [number, number];
    if (g.type === 'LineString')      return [ (g.coordinates as [number,number][]) .map(toRaDec) ];
    if (g.type === 'MultiLineString') return (g.coordinates as [number,number][][]).map(seg => seg.map(toRaDec));
    return [];
  }

  async loadOnce() {
    if (!isPlatformBrowser(this.platformId) || this._loaded()) return;

    const url = `${D3C_BASE}/asterisms.json`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const gj = await res.json();

    const items: Asterism[] = (gj.features || []).map((f: any) => {
      const p = f.properties || {};
      const name = p.name || 'Asterism';
      const abbrev = p.abbr || name.slice(0,3).toUpperCase();
      const segments = this.featureToSegments(f);
      const first = segments?.[0]?.[0] || null;
      const label = first ? { ra_deg: first[0], dec: first[1] } : null;
      return { abbrev, name, segments, label };
    });

    this._data.set({ meta: { source: 'd3-celestial asterisms' }, items });
    this._loaded.set(true);
  }
}
