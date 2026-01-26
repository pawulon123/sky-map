import { Injectable, inject } from '@angular/core';
import { Star } from '../../../domain/models/star.model';
import { SelectedIdService } from '../../../domain/services/sky-map-state/allowed-ids-policy.service';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { ConstellationPanelsLayoutService } from '../constellation-panels-layout.service';
import {
  PanelStarPoint,
  computePanelLabelLayoutEngine,
  PanelLabelSettings,
  invertPanelTransform,
} from './compute-labels-star.helpers';
import { PanelLabelPlacement } from './label-star.model';
import { ConstellationPanelVM } from '../../../domain/models/panels.model';

@Injectable({ providedIn: 'root' })
export class ConstellationPanelLabelsService {
  private state = inject(SkyMapStateService);
  private selectedId = inject(SelectedIdService);
  private layoutSvc = inject(ConstellationPanelsLayoutService);

  /**
   * Główna metoda – analogicznie do sky-map LabelService.
   * getLabelLines – funkcja budująca linie etykiety (cache w komponencie, jak u Ciebie).
   */
  computePanelLabels(getLabelLines: (star: Star) => string[]): PanelLabelPlacement[] {
    const panels = this.layoutSvc.layout().panels;

    const labelsSettings = this.getSettings();
    if (!labelsSettings.visible) return [];

    // budujemy punkty (panelId + globalne x/y)
    const points: PanelStarPoint[] = [];
    for (const p of panels) {
      for (const rs of p.stars) {
        if (!rs?.star) continue;
        points.push({
          panelId: p.id,
          star: rs.star,
          x: rs.x,
          y: rs.y,
          r: rs.r,
        });
      }
    }

    // opcjonalnie: filtr Allowed IDs (tak jak w sky-map)
    const filteredStars = this.selectedId.filter(points.map((p) => p.star));
    const allowed = new Set(filteredStars);
    const filteredPoints = points.filter((p) => allowed.has(p.star));

    const collisionsEnabled = !!labelsSettings.colision;

    return computePanelLabelLayoutEngine({
      settings: labelsSettings,
      points: filteredPoints,
      getLabelLines,
      collisionsEnabled,
    });
  }

  computePanelLabelsForPanel(
    panel: ConstellationPanelVM,
    getLabelLines: (s: Star) => string[],
    coordinateSpace: 'global' | 'panel' = 'global'
  ) {
    const settings = this.getSettings();
    if (!settings.visible) return [];

    // 1) budujemy punkty do silnika layoutu
    const points: PanelStarPoint[] = (panel.stars ?? [])
      .filter((rs) => !!(rs as any).star) // zakładam, że dodałeś rs.star: Star
      .map((rs: any) => {
        const star: Star = rs.star;
        const xGlobal: number = rs.x;
        const yGlobal: number = rs.y;
        const r: number | undefined = rs.r;

        if (coordinateSpace === 'global') {
          return { panelId: panel.id, star, x: xGlobal, y: yGlobal, r };
        }

        // coordinateSpace === 'panel' -> przelicz global -> model panelu
        const inv = invertPanelTransform(panel.transform);
        const [xModel, yModel] = inv.apply(xGlobal, yGlobal);
        return { panelId: panel.id, star, x: xModel, y: yModel, r };
      });

    // 2) filtr Allowed IDs (jak w sky-map)
    const allowedStars = this.selectedId.filter(points.map((p) => p.star));
    const allowedSet = new Set(allowedStars);
    const filteredPoints = points.filter((p) => allowedSet.has(p.star));

    // 3) silnik kolizji / placementu
    return computePanelLabelLayoutEngine({
      settings,
      points: filteredPoints,
      getLabelLines,
      collisionsEnabled: !!settings.colision,
    });
  }

  private getSettings(): PanelLabelSettings {
    // możesz to przepiąć na osobne ustawienia paneli; na razie reuse z labels
    const s: any = this.state.getStarSettings().labels;

    return {
      visible: !!s.visible,
      colision: !!s.colision,
      magnitudeRange: s.magnitudeRange,
      fontSize: s.fontSize ?? 10,
      letterSpacing: s.letterSpacing ?? 0,
      lineHeight: s.lineHeight, // jeśli masz
      offsetPx: s.offsetPx ?? 4,
      paddingPx: 2,
      leaderLines: !!s.leaderLines, // jeśli dodasz do stanu
    };
  }
}
