import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal, computed, inject } from '@angular/core';
import { Star } from '../../models/star.model';

export interface StarsData {
  meta?: any;
  stars: Star[];
}

const ASSETS_STARS_JSON = 'hyg-stars.json';

@Injectable({ providedIn: 'root' })
export class StarsService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private _loaded = signal(false);
  private _data = signal<StarsData>({ meta: {}, stars: [] });

  data() {
    return this._data();
  }
  loaded() {
    return this._loaded();
  }
  /** Gwiazdy po najnowszej projekcji (każda ma __projected = [x,y] GOTOWE DO RYSOWANIA W SVG) */
  readonly projected = computed(() => this._data().stars);
  projectedStars() {
    return this.projected();
  }

  async loadOnce(reprojectStarsAfterLoad: () => void) {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this._loaded()) return;

    const res = await fetch(ASSETS_STARS_JSON, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${ASSETS_STARS_JSON}`);
    const json = await res.json();

    // json może być tablicą gwiazd albo obiektem { stars: [...] }
    const starsRaw: any[] = Array.isArray(json) ? json : (json.stars ?? []);
    const meta = Array.isArray(json) ? { source: 'assets' } : (json.meta ?? {});

    // Normalizacja pól - dbamy o ra_deg (w stopniach), dec (w stopniach), mag
    const stars: Star[] = starsRaw.map((raw): any => {
      // RA:
      // - jeśli mamy ra_deg (0..360) to bierzemy
      // - jeśli mamy ra (0..24h) to mnożymy razy 15
      let raDeg: number | undefined = raw.ra_deg;
      if (raDeg == null && typeof raw.ra === 'number') {
        raDeg = raw.ra * 15;
      }

      // Dec:
      const decDeg: number | undefined = raw.dec_deg ?? raw.dec;

      // Mag:
      const magVal: number | undefined = raw.mag ?? raw.vmag ?? raw.bt;

      // Zwracamy nowy obiekt typu Star (plus nasze techniczne pole __projected)
      const s: Star = {
        ...raw,
        ra_deg: raDeg,
        dec: decDeg,
        mag: magVal,
        name: raw.name,
        __projected: null,
      };

      return s;
    });

    this._data.set({ meta, stars });
    this._loaded.set(true);
    reprojectStarsAfterLoad();
  }

  /**
   * Przeliczenie pozycji na ekran.
   * projectFn: (lonDeg, latDeg) => [x, y] | null  // Twoja projekcja RA/Dec -> piksele (bez lustra)
   * widthPx: szerokość aktualnego SVG w pikselach (potrzebne żeby odbić w poziomie)
   *
   * Robimy tu dwa kroki:
   *  1. bierzemy [x,y] z projectFn
   *  2. odbijamy w poziomie: xMirrored = widthPx - x
   *  3. zapisujemy do s.__projected = [xMirrored, y]
   */

  updateProjection(
    projectFn: (lonDeg: number, latDeg: number) => [number, number] | null,
    widthPx: number,
    options?: { mirrorX?: boolean }
  ) {
    const mirrorX = options?.mirrorX;
    const prev = this._data();

    const starsUpdated = prev.stars.map((orig) => {
      const raDeg = orig.ra_deg;
      const decDeg = orig.dec;

      if (raDeg == null || decDeg == null || !Number.isFinite(raDeg) || !Number.isFinite(decDeg)) {
        return { ...orig, __projected: null };
      }

      const p = projectFn(raDeg, decDeg);

      if (!p) {
        return { ...orig, __projected: null };
      }

      let [x, y] = p;
      if (mirrorX) x = widthPx - x;

      return {
        ...orig,
        __projected: [x, y] as [number, number],
      };
    });

    this._data.set({
      ...prev,
      stars: starsUpdated,
    });
  }
}
