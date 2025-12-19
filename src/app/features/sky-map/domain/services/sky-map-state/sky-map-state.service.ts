import { effect, ElementRef, inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StarsLabelsSettings, StarsLayerSettings, StarsSymbolsSettings } from '../../models/stars-layer-settings.model';
import { RefreshProjectionService } from '../projection/refresh-projection.service';
import { ProjectionService } from '../projection/projection.service';
import { isTheSameValuesOfObjects, update } from '../../../../../core/utils/utils-function';
import { defaultStarsSettings } from '../../default/stars';
import { defaultProjectionSettings } from '../../default/projection';
import { ProjectionSettings } from '../../models/projection-options.model';
import { boundaryDefaultSettings } from '../../default/boundary';
import { AsterismSettings } from '../../models/asterisms.model';
import { asterismDefaultSettings } from '../../default/asterism';
import { ConstellationLineSettings } from '../../models/constellation-line.model';
import { constellationLineDefaultSettings } from '../../default/constellation-line';
import { updateEndNext } from '../../../../../core/utils/update-end-next';
import { BoundaryLayerSettings } from '../../models/boundary.model';
import { RenderSettings } from '../../models/render.model';
import { renderDefaultSettings } from '../../default/render-default';

@Injectable({
  providedIn: 'root',
})
export class SkyMapStateService {
  private refreshProjectionSv = inject(RefreshProjectionService);
  private projectionSv = inject(ProjectionService);

  private readonly starsLayerSettingsSubject = new BehaviorSubject<StarsLayerSettings>(defaultStarsSettings);
  private readonly projectionSettingsSubject = new BehaviorSubject<ProjectionSettings>(defaultProjectionSettings);
  private readonly boundariesLayerSettingsSubject = new BehaviorSubject<BoundaryLayerSettings>(boundaryDefaultSettings);
  private readonly asterismLayerSettingsSubject = new BehaviorSubject<AsterismSettings>(asterismDefaultSettings);
  private readonly constellationLineSettingsSubject = new BehaviorSubject<ConstellationLineSettings>(
    constellationLineDefaultSettings
  );
  private readonly renderSettingsSubject = new BehaviorSubject<RenderSettings>(renderDefaultSettings);

  readonly starsLayerSettings$: Observable<StarsLayerSettings> = this.starsLayerSettingsSubject.asObservable();
  readonly projectionSettings$: Observable<ProjectionSettings> = this.projectionSettingsSubject.asObservable();
  readonly boundariesLayerSettings$: Observable<BoundaryLayerSettings> =
    this.boundariesLayerSettingsSubject.asObservable();
  readonly asterismLayerSettings$: Observable<AsterismSettings> = this.asterismLayerSettingsSubject.asObservable();
  readonly constellationLineSettings$: Observable<ConstellationLineSettings> =
    this.constellationLineSettingsSubject.asObservable();

  svgRef: ElementRef<SVGSVGElement> | null = null;
  readonly renderSettings$: Observable<RenderSettings> = this.renderSettingsSubject.asObservable();

  constructor() {
    this.updateProjection();
  }

  updateProjection(): void {
    effect(() => {
      const proj = this.projectionSv.settings();
      const current = this.projectionSettingsSubject.getValue();

      if (isTheSameValuesOfObjects(current, proj)) return;
      const next: ProjectionSettings = update(proj, current);
      this.projectionSettingsSubject.next(next);
      this.refreshProjectionSv.reprojectStars();
    });
  }

  updateStarsSymbols(partialSymbols: Partial<StarsSymbolsSettings>): void {
    updateEndNext(partialSymbols, this.starsLayerSettingsSubject, 'symbols');
  }

  updateStarsLabels(partialLabels: Partial<StarsLabelsSettings>): void {
    updateEndNext(partialLabels, this.starsLayerSettingsSubject, 'labels');
  }
  updateBoundaryLabel(partialLabels: Partial<StarsLabelsSettings>): void {
    updateEndNext(partialLabels, this.boundariesLayerSettingsSubject, 'labels');
  }
  updateBoundaryLines(partialLabels: Partial<StarsLabelsSettings>): void {
    updateEndNext(partialLabels, this.boundariesLayerSettingsSubject, 'lines');
  }

  updateAsterism(partial: Partial<AsterismSettings>): void {
    updateEndNext(partial, this.asterismLayerSettingsSubject);
  }

  updateConstellationLine(partial: Partial<ConstellationLineSettings>): void {
    updateEndNext(partial, this.constellationLineSettingsSubject);
  }

  updateRender(partial: Partial<RenderSettings>): void {
    updateEndNext(partial, this.renderSettingsSubject);
  }

  setRefSvg(svgRef: ElementRef<SVGSVGElement>): void {
    this.svgRef = svgRef;
  }

  getStarSettings() {
    return this.starsLayerSettingsSubject.getValue();
  }
  getProjectionSettings() {
    return this.projectionSettingsSubject.getValue();
  }

  getBoundariesSettings(): BoundaryLayerSettings {
    return this.boundariesLayerSettingsSubject.getValue();
  }
  getConstalationLinesSettings(): ConstellationLineSettings {
    return this.constellationLineSettingsSubject.getValue();
  }
}
