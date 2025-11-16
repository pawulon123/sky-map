import { effect, inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ProjectionSettings,
  StarsLabelsSettings,
  StarsLayerSettings,
  StarsSymbolsSettings,
} from '../../models/stars-layer-settings.model';
import { RefreshProjectionService } from '../projection/refresh-projection.service';
import { ProjectionService } from '../projection/projection.service';
import { isTheSameValuesOfObjects } from '../../../../../core/utils/utils-function';
import { defaultStarsSettings } from '../../default/stars';
import { defaultProjectionSettings } from '../../default/projection';

@Injectable({
  providedIn: 'root',
})
export class SkyMapStateService {
  private refreshProjectionSv = inject(RefreshProjectionService);
  private projectionSv = inject(ProjectionService);

  private readonly starsLayerSettingsSubject = new BehaviorSubject<StarsLayerSettings>(defaultStarsSettings);
  private readonly projectionSettingsSubject = new BehaviorSubject<ProjectionSettings>(defaultProjectionSettings);

  readonly starsLayerSettings$: Observable<StarsLayerSettings> = this.starsLayerSettingsSubject.asObservable();
  readonly projectionSettings$: Observable<ProjectionSettings> = this.projectionSettingsSubject.asObservable();

  constructor() {
    this.updateProjection();
  }

  updateProjection(): void {
    effect(() => {
      const proj = this.projectionSv.settings();
      const current = this.projectionSettingsSubject.getValue();
      const prev = current;

      if (isTheSameValuesOfObjects(prev, proj)) return;
      const next: ProjectionSettings = {
        ...current,
        ...proj,
      };
      this.projectionSettingsSubject.next(next);
      this.refreshProjectionSv.reprojectStars();
    });
  }

  updateStarsSymbols(partialSymbols: Partial<StarsSymbolsSettings>): void {
    const current = this.starsLayerSettingsSubject.getValue();
    const next: StarsLayerSettings = {
      ...current,
      symbols: {
        ...current.symbols,
        ...partialSymbols,
      },
    };
    this.starsLayerSettingsSubject.next(next);
  }

  updateStarsLabels(partialLabels: Partial<StarsLabelsSettings>): void {
    const current = this.starsLayerSettingsSubject.getValue();
    const next: StarsLayerSettings = {
      ...current,
      labels: {
        ...current.labels,
        ...partialLabels,
      },
    };
    this.starsLayerSettingsSubject.next(next);
  }
}
