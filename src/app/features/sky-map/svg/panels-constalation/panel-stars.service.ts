import { Injectable, effect, inject, signal } from '@angular/core';
import { StarsService } from '../../domain/services/stars/stars.service';
import { Star } from '../../domain/models/star.model';
import { BBox, PanelStarSymbolSettings, RenderPanelStar } from '../../domain/models/panels.model';
import { raAlign, wrapDeltaRa } from './sky-panel-projection.util';
import { defaultStarsSettings } from '../../domain/default/stars';
import { createRadius, getPropBaseRadius } from '../../common/star-symbol-helper';
import { SkyMapStateService } from '../../domain/services/sky-map-state/sky-map-state.service';

export interface BuildPanelStarsArgs {
  stars: Star[];
  raCenter: number;
  bbox: BBox;
  scale: number;
  panelX0: number;
  panelY0: number;
  panelW: number;
  panelH: number;
  pad: number;
  dxCenter: number;
  dyCenter: number;
  maxMag: number;
  // settings?: PanelStarSymbolSettings;
}

@Injectable({ providedIn: 'root' })
export class PanelStarsService {
  private starsSvc = inject(StarsService);
  private state = inject(SkyMapStateService);
  // SNAPSHOT gwiazd jako SIGNAL (żeby zależności w computed zadziałały)
  private rawStarsSig = signal<Star[]>([]);
  starSettongsSig = this.state.starSettingsSig();
  constructor() {
    this.starsSvc.loadOnce(() => {}).catch((err) => console.error('Stars loadOnce failed', err));

    // Złap snapshot tylko raz, gdy dane będą gotowe
    effect(() => {
      const loaded = this.starsSvc.loaded();
      if (!loaded) return;

      // jeśli już mamy snapshot, nie nadpisuj (ignoruj np. updateProjection)
      if (this.rawStarsSig().length > 0) return;

      const stars = this.starsSvc.data().stars ?? [];
      this.rawStarsSig.set(stars);
    });
  }

  getAllStars(): Star[] {
    return this.rawStarsSig();
  }

  buildPanelStars(args: BuildPanelStarsArgs): RenderPanelStar[] {
    const {
      raCenter,
      bbox,
      scale: s,
      panelX0: x0,
      panelY0: y0,
      panelW,
      panelH,
      pad,
      dxCenter,
      dyCenter,
      maxMag,
    } = args;

    // const sym = { ...defaultStarsSettings.symbols, ...(settings ?? {}) };
    const { symbols: settings } = this.starSettongsSig();
    const offX = pad + dxCenter;
    const offY = pad + dyCenter;

    const magLimit = Number.isFinite(settings.magMax as number) ? (settings.magMax as number) : maxMag;

    const result: RenderPanelStar[] = [];

    // UWAGA: teraz to jest sygnał -> jeśli było [] na starcie,
    // layout przeliczy się ponownie po rawStarsSig.set(...)
    for (const st of this.getAllStars()) {
      const ra = st.ra_deg;
      const dec = st.dec;
      const mag = st.mag ?? null;

      if (ra == null || dec == null) continue;
      if (!Number.isFinite(ra) || !Number.isFinite(dec)) continue;
      if (mag != null && Number.isFinite(mag) && mag > magLimit) continue;

      const raFixed = raAlign(ra);
      const lx = wrapDeltaRa(raFixed, raCenter);
      const ly = -dec;

      const px = (lx - bbox.minX) * s + offX;
      const py = (ly - bbox.minY) * s + offY;

      if (px < 0 || py < 0 || px > panelW || py > panelH) continue;

      const r = createRadius(st, settings);
      const propsBaseRadis = getPropBaseRadius(r, settings);

      result.push({
        star: st,
        x: x0 + px,
        y: y0 + py,
        mag,
        shape: settings.shape,
        r,
        polygonPoints: '',
        customTransform: '',
        ...propsBaseRadis,
      });
    }

    return result.sort((a, b) => (a.mag ?? 99) - (b.mag ?? 99));
  }
}
