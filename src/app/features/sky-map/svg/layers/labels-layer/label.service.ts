import { inject, Injectable } from '@angular/core';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { StarsService } from '../../../domain/services/stars/stars.service';
import { Star } from '../../../domain/models/star.model';
import { LabelPlacement } from '../../../domain/models/stars-layer-settings.model';
import { hasNameOrBayer, projected } from './helpers';
import { computeLabelLayoutEngine } from './compute-label-layou';
import { SelectedIdService } from '../../../domain/services/sky-map-state/allowed-ids-policy.service';
import { LabelsLayoutStrategy } from '../../panels-constalation/label-star/labels-layout-strategy';

@Injectable({
  providedIn: 'root',
})
export class LabelStarMapService implements LabelsLayoutStrategy {
  private state = inject(SkyMapStateService);
  private starService = inject(StarsService);
  private selectedId = inject(SelectedIdService);

  computeLabelLayout(getLabelLines: (star: Star) => string[]): LabelPlacement[] {
    const settings = this.state.getStarSettings().labels;
    const stars = this.getStarsForLabels();

    const filteredStars: Star[] = this.selectedId.filter(stars);
    const collisionsEnabled = this.getDataForColision();

    return computeLabelLayoutEngine({
      settings,
      stars: filteredStars,
      getLabelLines,
      collisionsEnabled,
    });
  }
  getDataForColision() {
    return !!this.state.getStarSettings().labels.colision;
  }

  private getStarsForLabels(): Star[] {
    return this.starService.data().stars.filter((s) => hasNameOrBayer(s));
  }
}
