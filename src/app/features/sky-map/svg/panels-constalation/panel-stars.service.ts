import { Injectable, inject } from '@angular/core';
import { StarsService } from '../../domain/services/stars/stars.service';
import { Star } from '../../domain/models/star.model';
import { BBox, PanelStarShape, PanelStarSymbolSettings, RenderPanelStar } from '../../domain/models/panels.model';

import { raAlign, wrapDeltaRa } from './sky-panel-projection.util';
import { SkyMapStateService } from '../../domain/services/sky-map-state/sky-map-state.service';
import { StarsSymbolsSettings } from '../../domain/models/stars-layer-settings.model';
import { defaultStarsSettings } from '../../domain/default/stars';
import { createRadius, getPropBaseRadius } from '../../common/star-symbol-helper';

export interface BuildPanelStarsArgs {
  stars: Star[];
  raCenter: number;
  bbox: BBox;
  scale: number;

  // pozycja panelu w globalnym SVG
  panelX0: number;
  panelY0: number;

  panelW: number;
  panelH: number;

  // offset dopasowania (tak jak w Twoim kodzie)
  pad: number;
  dxCenter: number;
  dyCenter: number;

  // fallback jeśli settings.magMax nie podasz
  maxMag: number;

  // NOWE: ustawienia symboli dla paneli (jak na mapie)
  settings?: PanelStarSymbolSettings;
}

@Injectable({ providedIn: 'root' })
export class PanelStarsService {
  private starsSvc = inject(StarsService);

  constructor() {
    void this.starsSvc.loadOnce(() => {}).catch((err) => console.error('Stars loadOnce failed', err));
  }

  /** Snapshot gwiazd */
  private getAllStars(): Star[] {
    return this.starsSvc.data().stars ?? [];
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

    const settings = { ...defaultStarsSettings.symbols, ...(args.settings ?? {}) };
    const sym = settings;

    const offX = pad + dxCenter;
    const offY = pad + dyCenter;

    const magLimit = Number.isFinite(sym.magMax as number) ? (sym.magMax as number) : maxMag;

    const result: RenderPanelStar[] = [];
   
    for (const st of this.getAllStars()) {
      const ra = st.ra_deg;
      const dec = st.dec;
      const mag = st.mag ?? null;

      if (ra == null || dec == null) continue;
      if (!Number.isFinite(ra) || !Number.isFinite(dec)) continue;
      if (mag != null && Number.isFinite(mag) && mag > magLimit) continue;

      // spójne z lonToRa
      const raFixed = raAlign(ra);

      // lokalny układ jak dla linii: x=ΔRA, y=-Dec
      const lx = wrapDeltaRa(raFixed, raCenter);
      const ly = -dec;

      // mapowanie do panelu
      const px = (lx - bbox.minX) * s + offX;
      const py = (ly - bbox.minY) * s + offY;

      // filtr: tylko to, co mieści się w panelu
      if (px < 0 || py < 0 || px > panelW || py > panelH) continue;
  
      const r = createRadius(st, sym);
      const propsBaseRadis = getPropBaseRadius(r, sym);

      result.push({
        star: st,
        x: x0 + px,
        y: y0 + py,
        mag,
        shape: sym.shape,
        r,
        polygonPoints: '',
        customTransform: '',

        ...propsBaseRadis,
      });
    }

    return result.sort((a, b) => (a.mag ?? 99) - (b.mag ?? 99));
  }
}
