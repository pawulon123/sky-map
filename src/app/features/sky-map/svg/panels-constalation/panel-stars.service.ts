import { Injectable, inject } from '@angular/core';
import { StarsService } from '../../domain/services/stars/stars.service';
import { Star } from '../../domain/models/star.model';
import { BBox, PanelStarShape, PanelStarSymbolSettings, RenderPanelStar } from '../../domain/models/panels.model';

import { raAlign, wrapDeltaRa } from './sky-panel-projection.util';
import { SkyMapStateService } from '../../domain/services/sky-map-state/sky-map-state.service';
import { StarsSymbolsSettings } from '../../domain/models/stars-layer-settings.model';
import { defaultStarsSettings } from '../../domain/default/stars';

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
  getAllStars(): Star[] {
    return this.starsSvc.data().stars ?? [];
  }

  buildPanelStars(args: BuildPanelStarsArgs): RenderPanelStar[] {
    const {
      stars,
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

    for (const st of stars) {
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

      // promień bazowy zależny od jasności
      const rBase = this.radiusFromMag(st);

      // skala po jasności (0..50)
      const magScale = this.magnitudeScale(mag, sym.scaleByMagnitude ?? 0);

      const scale = (sym.size ?? 1) * magScale;
      const r = rBase * scale;

      // stroke widths proporcjonalnie do r (jak w mapie)
      const baseStrokeWidth = r * 0.25 * (sym.strokeWidth ?? 1);
      const ringStrokeWidth = r * (sym.strokeWidth ?? 0.4);
      const crossStrokeWidth = r * 0.3 * (sym.strokeWidth ?? 1);

      const { polygonPoints, customTransform } = this.getPropForShape(sym.shape, r);

      const fillOpacity = sym.fillOpacity ?? 1;
      const strokeOpacity = sym.strokeOpacity ?? 1;
      const strokeColor = sym.strokeColor ?? sym.color ?? 'currentColor';
      const fillColor = sym.shape === 'ring' ? 'none' : (sym.color ?? 'currentColor');
      const hasFill = !!sym.fillOpacity;

      result.push({
        star: st,

        // uwaga: globalne współrzędne w dużym SVG
        x: x0 + px,
        y: y0 + py,

        mag,

        shape: sym.shape,

        r,
        polygonPoints,
        customTransform,

        baseStrokeWidth,
        ringStrokeWidth,
        crossStrokeWidth,

        fillColor,
        fillOpacity,
        strokeColor,
        strokeOpacity,
        hasFill,
        opacity: fillOpacity,
      });
    }

    // opcjonalnie: sort jak w mapie (jaśniejsze na wierzchu)
    return result.sort((a, b) => (a.mag ?? 99) - (b.mag ?? 99));
  }

  // ====== LOGIKA SYMBOLI (przeniesiona 1:1 z mapy, dopasowana do paneli) ======

  private getPropForShape(shape: PanelStarShape, r: number): { polygonPoints: string; customTransform: string } {
    const propForShape = { polygonPoints: '', customTransform: '' };

    switch (shape) {
      case 'star':
        propForShape.polygonPoints = this.starPoints(r);
        break;
      case 'square':
        propForShape.polygonPoints = this.squarePoints(r);
        break;
      case 'triangle':
        propForShape.polygonPoints = this.trianglePoints(r);
        break;
      case 'custom': {
        const scale = r;
        propForShape.customTransform = `translate(${-0.5 * scale},${-0.5 * scale}) scale(${scale})`;
        break;
      }
      default:
        break;
    }
    return propForShape;
  }

  private radiusFromMag(s: Star, rMin = 0.2, rMax = 2.8): number {
    const mag = s.mag;
    const clamped = Math.max(-1.5, Math.min(8, mag ?? 6));
    const t = (8 - (clamped + 1.5)) / 9.5;
    return rMin + t * (rMax - rMin);
  }

  private starPoints(r: number): string {
    const outer = r;
    const inner = outer * 0.4;
    const pts: string[] = [];
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI / 5) * i - Math.PI / 2;
      const rr = i % 2 === 0 ? outer : inner;
      const x = Math.cos(angle) * rr;
      const y = Math.sin(angle) * rr;
      pts.push(`${x},${y}`);
    }
    return pts.join(' ');
  }

  private squarePoints(r: number): string {
    return `${-r},${-r} ${-r},${r} ${r},${r} ${r},${-r}`;
  }

  private trianglePoints(r: number): string {
    return `0,${-r} ${-r},${r} ${r},${r}`;
  }

  private magnitudeScale(
    mag: number | null | undefined,
    strength0to50: number,
    minMag = -1.5,
    maxMag = 8,
    minScale = 0.35,
    maxScale = 3.2,
    gamma = 2.9
  ): number {
    const strength = Math.max(0, Math.min(50, strength0to50));
    if (strength === 0) return 1;

    const m = Math.max(minMag, Math.min(maxMag, mag ?? 6));

    // t: 0..1 (0 = najsłabsze, 1 = najjaśniejsze)
    let t = (maxMag - m) / (maxMag - minMag);

    // nieliniowe wzmocnienie kontrastu
    t = Math.pow(t, gamma);

    const base = minScale + t * (maxScale - minScale);

    const k = strength / 50;
    return 1 + k * (base - 1);
  }
}
