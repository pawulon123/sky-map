import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { getComputedBoundary } from './get-computed-boundary';
import {
  Boundary,
  BoundaryLabels,
  BoundaryLayerSettings,
  BoundaryPath,
  Lines,
} from '../../../domain/models/boundary.model';
import { LabelBoundariesLayerComponent } from '../label-boundaries-layer/label-boundaries-layer.component';
import { map, Observable } from 'rxjs';
import { ReflectOnVerticalAxisDirective } from '../../../common/reflect-on-vertical-axis.directive';
import { LayersSvg } from '../../../domain/models/layers-svg';
import { BoundaryPathService } from './boundary-path.service';

@Component({
  selector: 'g[app-boundaries-layer]',
  standalone: true,
  imports: [CommonModule, LabelBoundariesLayerComponent, ReflectOnVerticalAxisDirective],
  templateUrl: 'boundaries-layer.component.html',
})
export class BoundariesLayerComponent {
  private state = inject(SkyMapStateService);

  private boundaryPathSv = inject(BoundaryPathService);
  readonly paths: Signal<BoundaryPath[]> = this.boundaryPathSv.paths;

  private readonly boundariesSettings$ = this.state.boundariesLayerSettings$;
  readonly projectionSettings$ = this.state.projectionSettings$;

  readonly boundariesSettingsView$: Observable<BoundaryLayerSettings> = this.boundariesSettings$.pipe(
    map((settings) => this.scratchDashed(settings))
  );

  private hoveredAbbrev: string | null = null;
  layersSvg = LayersSvg;
  private scratchDashed(settings: BoundaryLayerSettings): BoundaryLayerSettings {
    const { lines } = settings;

    const dasharray = lines.style === 'dashed' && lines.dashSize > 0 ? `${lines.dashSize} ${lines.dashSize}` : null;

    return {
      ...settings,
      lines: {
        ...lines,
        dasharray,
      },
    };
  }

  onBoundaryEnter(boundary: Boundary | undefined): void {
    this.hoveredAbbrev = boundary?.abbrev ?? null;
  }

  onBoundaryLeave(): void {
    this.hoveredAbbrev = null;
  }

  isHovered(boundary?: Boundary): boolean {
    return boundary?.abbrev === this.hoveredAbbrev;
  }

  getTooltip(boundary: Boundary, pathD: string): string {
    const language = this.state.getBoundariesSettings().labels.language;
    return getComputedBoundary(boundary, pathD, language);
  }
}
