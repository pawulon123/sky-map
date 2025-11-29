import { inject, Injectable } from '@angular/core';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { StarsService } from '../../../domain/services/stars/stars.service';
import { Star } from '../../../domain/models/star.model';

import { LabelPlacement } from '../../../domain/models/stars-layer-settings.model';
import { hasNameOrBayer, projected } from './helpers';
import { computeLabelLayoutEngine } from './compute-label-layou';

@Injectable({
  providedIn: 'root',
})
export class LabelService {
  private state = inject(SkyMapStateService);
  private starService = inject(StarsService);

  computeLabelLayout(getLabelLines: (star: Star) => string[]): LabelPlacement[] {
    const settings = this.state.getStarSettings().labels;
    const stars = this.getStarsForLabels();
    const collisionsEnabled = this.getDataForColision();

    return computeLabelLayoutEngine({
      settings,
      stars,
      getLabelLines,
      collisionsEnabled,
    });
  }
  getDataForColision() {
    return !!this.state.getStarSettings().labels.colision;
  }

  private getStarsForLabels(): Star[] {
    return this.starService
      .data()
      .stars.filter((s) => hasNameOrBayer(s))
      .filter((s) => projected(s));
  }
}
