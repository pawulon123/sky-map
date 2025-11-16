import { effect, inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StarsLabelsSettings, StarsLayerSettings, StarsSymbolsSettings } from '../../models/stars-layer-settings.model';
import { RefreshProjectionService } from '../projection/refresh-projection.service';
import { ProjectionService } from '../projection/projection.service';
import { isTheSameValuesOfObjects } from '../../../../../core/utils/utils-function';
import { defaultStarsSettings } from '../../default/stars';
import { defaultProjectionSettings } from '../../default/projection';
import { ProjectionSettings } from '../../models/projection-options.model';
import { boundaryDefaultSettings } from '../../default/boundary';
import { BoundarySettings } from '../../models/boundary.model';
import { AsterismSettings } from '../../models/asterisms.model';
import { asterismDefaultSettings } from '../../default/asterism';
import { ConstellationLineSettings } from '../../models/constellation-line.model';
import { constellationLineDefaultSettings } from '../../default/constellation-line';

@Injectable({
  providedIn: 'root',
})
export class SkyMapStateService {
  private refreshProjectionSv = inject(RefreshProjectionService);
  private projectionSv = inject(ProjectionService);

  private readonly starsLayerSettingsSubject = new BehaviorSubject<StarsLayerSettings>(defaultStarsSettings);
  private readonly projectionSettingsSubject = new BehaviorSubject<ProjectionSettings>(defaultProjectionSettings);
  private readonly boundariesLayerSettingsSubject = new BehaviorSubject<BoundarySettings>(boundaryDefaultSettings);
  private readonly asterismLayerSettingsSubject = new BehaviorSubject<AsterismSettings>(asterismDefaultSettings);
  private readonly constellationLineSettingsSubject = new BehaviorSubject<ConstellationLineSettings>(
    constellationLineDefaultSettings
  );

  readonly starsLayerSettings$: Observable<StarsLayerSettings> = this.starsLayerSettingsSubject.asObservable();
  readonly projectionSettings$: Observable<ProjectionSettings> = this.projectionSettingsSubject.asObservable();
  readonly boundariesLayerSettings$: Observable<BoundarySettings> = this.boundariesLayerSettingsSubject.asObservable();
  readonly asterismLayerSettings$: Observable<AsterismSettings> = this.asterismLayerSettingsSubject.asObservable();
  readonly constellationLineSettings$: Observable<ConstellationLineSettings> =
    this.constellationLineSettingsSubject.asObservable();

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

  updateBoundary(partial: Partial<BoundarySettings>): void {
    const current = this.boundariesLayerSettingsSubject.getValue();
    const next: BoundarySettings = {
      ...current,
      ...partial,
    };

    this.boundariesLayerSettingsSubject.next(next);
  }
  updateAsterism(partial: Partial<AsterismSettings>): void {
    const current = this.asterismLayerSettingsSubject.getValue();
    const next: AsterismSettings = {
      ...current,
      ...partial,
    };

    this.asterismLayerSettingsSubject.next(next);
  }
  updateConstellationLine(partial: Partial<ConstellationLineSettings>): void {
    const current = this.constellationLineSettingsSubject.getValue();
    const next: ConstellationLineSettings = {
      ...current,
      ...partial,
    };

    this.constellationLineSettingsSubject.next(next);
  }
}
