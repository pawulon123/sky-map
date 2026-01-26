import { Injectable, computed, inject, signal } from '@angular/core';
import { ConstellationLine } from '../../domain/services/constellation-lines/constellation-lines.service';
import { ConstellationGeometryService } from './constellation-geometry.service';
import { PanelStarsService } from './panel-stars.service';
import { ConstellationPanelsLayoutVM, ConstellationPanelVM, RenderPanelStar } from '../../domain/models/panels.model';
import { SkyMapStateService } from '../../domain/services/sky-map-state/sky-map-state.service';
import { SelectedIdService } from '../../domain/services/sky-map-state/allowed-ids-policy.service';
import { makeShortenedSegmentPathsXY } from './sky-panel-projection.util';

@Injectable({ providedIn: 'root' })
export class ConstellationPanelsLayoutService {
  private geom = inject(ConstellationGeometryService);
  private panelStars = inject(PanelStarsService);
  private state = inject(SkyMapStateService);

  private selectedId = inject(SelectedIdService);

  private readonly MAX_MAG = 6.5;

  starSettongsSig = this.state.starSettingsSig();
  projectionSettongsSig = this.state.projectionSettingsSig();
  constalationLinesSettongsSig = this.state.constalationLinesSettingsSig();

  readonly layout = computed<ConstellationPanelsLayoutVM>(() => {console.log('ddcws');
  
    const items = this.geom.isCallMakeSens();
    const filtretItems = this.selectedId.filter(items);
    const { gap, panelSize, columns } = this.projectionSettongsSig();

    if (items.length === 0 || filtretItems.length === 0) {
      return { totalW: panelSize.w, totalH: panelSize.h, panels: [] };
    }
    const rows = Math.ceil(filtretItems.length / columns);
    const totalW = columns * panelSize.w + (columns - 1) * gap;
    const totalH = rows * panelSize.h + (rows - 1) * gap;

    const panels = filtretItems.map((c, i) => this.buildPanel(c, i, panelSize.w, panelSize.h));

    return { totalW, totalH, panels };
  });

  private buildPanel(c: ConstellationLine, i: number, PANEL_W: number, PANEL_H: number): ConstellationPanelVM {
    const { padding, gap, columns } = this.projectionSettongsSig();

    const nodeGap = this.constalationLinesSettongsSig().nodeGap ?? 0;
    const nGap = Math.max(0, nodeGap);

    const col = i % columns;
    const row = Math.floor(i / columns);

    const x0 = col * (PANEL_W + gap);
    const y0 = row * (PANEL_H + gap);

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

    const innerW = PANEL_W - 2 * padding;
    const innerH = PANEL_H - 2 * padding;

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

    const gapModel = s > 0 ? nGap / s : 0;
    const paths = makeShortenedSegmentPathsXY(g.segsXY, gapModel);

    const transform = [
      `translate(${x0 + padding + dx},${y0 + padding + dy})`,
      `scale(${s})`,
      `translate(${-g.bbox.minX},${-g.bbox.minY})`,
    ].join(' ');

    // gwiazdy

    const { symbols: settings } = this.starSettongsSig();
    let stars: RenderPanelStar[] = [];
    if (settings.visible) {
      stars = this.panelStars.buildPanelStars({
        stars: [],
        raCenter: g.raCenter,
        bbox: g.bbox,
        scale: s,
        panelX0: x0,
        panelY0: y0,
        panelW: PANEL_W,
        panelH: PANEL_H,
        pad: padding,
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
      paths,
      label,
      stars,
    };
  }
}
