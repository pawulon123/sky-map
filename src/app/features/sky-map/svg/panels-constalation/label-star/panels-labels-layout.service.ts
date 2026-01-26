import { Injectable, inject } from '@angular/core';
import { Star } from '../../../domain/models/star.model';
import { LabelPlacement } from '../../../domain/models/stars-layer-settings.model';
import { ConstellationPanelsLayoutService } from '../constellation-panels-layout.service';
import { LabelsLayoutStrategy } from './labels-layout-strategy';


@Injectable({ providedIn: 'root' })
export class PanelsLabelsLayoutService implements LabelsLayoutStrategy {
  private panelsLayout = inject(ConstellationPanelsLayoutService);

  computeLabelLayout(getLines: (star: Star) => string[]): LabelPlacement[] {

    const layout = this.panelsLayout.layout();
    const placements: LabelPlacement[] = [];

    for (const p of layout.panels) {
      for (const rs of p.stars ?? []) {
        const star = rs.star as Star;
        const lines = getLines(star);
        if (!lines || lines.length === 0) continue;

        const r = (rs as any).r ?? 2;

        placements.push({
          star,
          x: rs.x + r + 3,
          y: rs.y - r - 3,
          positionKey:'right'
        });
      }
    }

    return placements;
  }
}
