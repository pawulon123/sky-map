// adaptive-labels-layout.service.ts
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { Star } from '../../../domain/models/star.model';
import { LabelPlacement } from '../../../domain/models/stars-layer-settings.model';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { defaultProjectionSettings } from '../../../domain/default/projection';

import { PanelsLabelsLayoutService } from './panels-labels-layout.service';
import { LabelStarMapService } from '../../layers/labels-layer/label.service';

@Injectable({ providedIn: 'root' })
export class AdaptiveLabelsLayoutService {
  private state = inject(SkyMapStateService);
  private map = inject(LabelStarMapService);
  private panels = inject(PanelsLabelsLayoutService);

  private modeSig = toSignal(this.state.projectionSettings$.pipe(map((s) => s.mode)), {
    initialValue: defaultProjectionSettings.mode,
  });

  computeLabelLayout(getLines: (star: Star) => string[]): LabelPlacement[] {
    const mode = this.modeSig();
    const strategy = mode === 'panels' ? this.panels : this.map;
    return strategy.computeLabelLayout(getLines);
  }
}
