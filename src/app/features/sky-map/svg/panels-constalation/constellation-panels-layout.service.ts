import { Injectable, computed, inject, signal } from '@angular/core';
import { ConstellationLine } from '../../domain/services/constellation-lines/constellation-lines.service';
import { ConstellationGeometryService } from './constellation-geometry.service';
import { PanelStarsService } from './panel-stars.service';
import { ConstellationPanelsLayoutVM, ConstellationPanelVM, RenderPanelStar } from '../../domain/models/panels.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { defaultStarsSettings } from '../../domain/default/stars';
import { SkyMapStateService } from '../../domain/services/sky-map-state/sky-map-state.service';
import { SelectedIdService } from '../../domain/services/sky-map-state/allowed-ids-policy.service';

@Injectable({ providedIn: 'root' })
export class ConstellationPanelsLayoutService {
  private geom = inject(ConstellationGeometryService);
  private panelStars = inject(PanelStarsService);
  private state = inject(SkyMapStateService);

  private selectedId = inject(SelectedIdService);
  /** Wymiary panelu w jednostkach SVG */
  private readonly panelSize = signal({ w: 400, h: 300 });

  /** Odstęp między panelami */
  private readonly GAP = 10;

  /** Padding wewnętrzny w panelu */
  private readonly PAD = 40;

  /** Liczba paneli w wierszu */
  private readonly COLS = 8;

  /** Limit jasności */
  private readonly MAX_MAG = 6.5;

  // opcjonalnie public setter

  private readonly starSettingsSig = toSignal(this.state.starsLayerSettings$, {
    initialValue: defaultStarsSettings,
  });

  setPanelSize(w: number, h: number) {
    this.panelSize.set({ w, h });
  }

  readonly layout = computed<ConstellationPanelsLayoutVM>(() => {
    const loaded = this.geom.loaded();
    const items = this.geom.sortedConstellations();
    const filtretItems = this.selectedId.filter(items);

    // const sym = settings.symbols;
    const { w: PANEL_W, h: PANEL_H } = this.panelSize();

    if (!loaded || filtretItems.length === 0) {
      return { totalW: PANEL_W, totalH: PANEL_H, panels: [] };
    }

    const rows = Math.ceil(filtretItems.length / this.COLS);

    const totalW = this.COLS * PANEL_W + (this.COLS - 1) * this.GAP;
    const totalH = rows * PANEL_H + (rows - 1) * this.GAP;

    const panels = filtretItems.map((c, i) => this.buildPanel(c, i, PANEL_W, PANEL_H));

    return { totalW, totalH, panels };
  });

  private buildPanel(c: ConstellationLine, i: number, PANEL_W: number, PANEL_H: number): ConstellationPanelVM {
    const col = i % this.COLS;
    const row = Math.floor(i / this.COLS);

    const x0 = col * (PANEL_W + this.GAP);
    const y0 = row * (PANEL_H + this.GAP);

    const id = `panel-${c.constelationId}`;
    const clipId = `clip-${id}`;

    const g = this.geom.buildGeometry(c);

    if (!g.bbox) {
      return {
        id,
        constelationId: c.constelationId,
        name: c.name,
        abbrev: c.abbrev,
        x: x0,
        y: y0,
        w: PANEL_W,
        h: PANEL_H,
        clipId,
        transform: `translate(${x0},${y0})`,
        paths: [],
        label: { x: x0 + 8, y: y0 + 18, text: c.abbrev ?? c.constelationId },
        stars: [],
      };
    }

    const innerW = PANEL_W - 2 * this.PAD;
    const innerH = PANEL_H - 2 * this.PAD;

    const w0 = g.bbox.maxX - g.bbox.minX;
    const h0 = g.bbox.maxY - g.bbox.minY;

    const safeW = Math.max(1e-9, w0);
    const safeH = Math.max(1e-9, h0);

    // Fit-to-rect
    const s = Math.min(innerW / safeW, innerH / safeH);

    const scaledW = w0 * s;
    const scaledH = h0 * s;

    const dx = (innerW - scaledW) / 2;
    const dy = (innerH - scaledH) / 2;

    const transform = [
      `translate(${x0 + this.PAD + dx},${y0 + this.PAD + dy})`,
      `scale(${s})`,
      `translate(${-g.bbox.minX},${-g.bbox.minY})`,
    ].join(' ');

    // gwiazdy

    
    const { symbols: settings } = this.starSettingsSig();
    let stars: RenderPanelStar[] = []
    if(settings.visible){

       stars = this.panelStars.buildPanelStars({
        stars: [],
        raCenter: g.raCenter,
        bbox: g.bbox,
        scale: s,
        panelX0: x0,
        panelY0: y0,
        panelW: PANEL_W,
        panelH: PANEL_H,
        pad: this.PAD,
        dxCenter: dx,
        dyCenter: dy,
        maxMag: this.MAX_MAG,
        settings,
      });
    }
    const label = { x: x0 + 8, y: y0 + 18, text: c.abbrev ?? c.constelationId };

    return {
      id,
      constelationId: c.constelationId,
      name: c.name,
      abbrev: c.abbrev,
      x: x0,
      y: y0,
      w: PANEL_W,
      h: PANEL_H,
      clipId,
      transform,
      paths: g.paths,
      label,
      stars,
    };
  }
}
