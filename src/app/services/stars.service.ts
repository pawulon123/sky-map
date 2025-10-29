import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal, computed } from '@angular/core';
import { Star } from '../domain/stars/star.model';


export interface StarsData { meta?: any; stars: Star[]; }
// Uwaga: absolutna ścieżka do assets
const ASSETS_STARS_JSON = 'hyg-stars.json';

@Injectable({ providedIn: 'root' })
export class StarsService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private _loaded = signal(false);
  private _data   = signal<StarsData>({ meta: {}, stars: [] });

  /** Publiczne „snapshociki” (zgodnie z Twoim stylem) */
  data()   { return this._data(); }
  loaded() { return this._loaded(); }

  /** Publiczny widok: przeliczone gwiazdy (Signal) + alias-funkcja */
  readonly projected = computed(() => this._data().stars);
  projectedStars() { return this.projected(); }

  /** Jednorazowy load z assets (tylko w przeglądarce) */
  async loadOnce() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this._loaded()) return;

    const res = await fetch(ASSETS_STARS_JSON, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${ASSETS_STARS_JSON}`);
    const json = await res.json();

    const stars: Star[] = Array.isArray(json) ? json : (json.stars ?? []);
    const meta          = Array.isArray(json) ? { source: 'assets' } : (json.meta ?? {});

    // Uzupełnij ra_deg, jeśli jest tylko ra (w godzinach)
    for (const s of stars) {
      if (s.ra_deg == null && typeof s.ra === 'number') s.ra_deg = s.ra * 15;
      // zapewnij pole pod projekcję
      (s as any).__projected = null as [number, number] | null;
    }

    this._data.set({ meta, stars });
    this._loaded.set(true);
  }

  /** Przeliczenie [ra°,dec] -> [x,y] i zapis do __projected */
updateProjection(project: (lonDeg: number, latDeg: number) => [number, number] | null) {
  const d = this._data();
  const stars = d.stars.map(s => {
    if (s.ra_deg != null && s.dec != null) {
      const p = project(s.ra_deg, s.dec);
      s.__projected = p ? [p[0], p[1]] as [number, number] : null;
    } else {
      s.__projected = null;
    }
    return s;
  });
  this._data.set({ ...d, stars });
}
}
