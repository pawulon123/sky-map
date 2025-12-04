import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { getComputedBoundary } from './get-computed-boundary';
import { Boundary, BoundaryPath } from '../../../domain/models/boundary.model';
import { BoundaryPathService } from './boundary-path.service';
import { ProjectionService } from '../../../domain/services/projection/projection.service';
import { LabelBoundariesLayerComponent } from '../label-boundaries-layer/label-boundaries-layer.component';

@Component({
  selector: 'g[app-boundaries-layer]',
  standalone: true,
  imports: [CommonModule, LabelBoundariesLayerComponent],
  templateUrl: 'boundaries-layer.component.html',
  host: {
    '[attr.transform]': 'transform()',
  },
})
export class BoundariesLayerComponent {
  private boundaryPathSv = inject(BoundaryPathService);
  private state = inject(SkyMapStateService);
  private proj = inject(ProjectionService);

  boundariesSettings$ = this.state.boundariesLayerSettings$;
  transform = this.reflectOnTheVerticalAxis();

  hoveredAbbrev: string | null = null;

  paths: Signal<BoundaryPath[]> = this.boundaryPathSv.paths;

  onBoundaryEnter(boundary: Boundary | undefined): void {
    this.hoveredAbbrev = boundary?.abbrev ?? null;
  }

  onBoundaryLeave(): void {
    this.hoveredAbbrev = null;
  }

  isHovered(boundary?: Boundary): boolean {
    return boundary?.abbrev === this.hoveredAbbrev;
  }

  private reflectOnTheVerticalAxis() {
    return computed(() => {
      let { width, mirrorX } = this.proj.settings();
      mirrorX = !mirrorX;
      if (!mirrorX) return null;
      return `translate(${width},0) scale(-1,1)`;
    });
  }

  getTooltip(boundary: Boundary, pathD: string): string {
    const language = this.state.getBoundariesSettings().labels.language;
    return getComputedBoundary(boundary, pathD, language);
  }
}
