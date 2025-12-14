import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { ConstellationLinesService } from '../../../domain/services/constellation-lines/constellation-lines.service';
import { ProjectionService } from '../../../domain/services/projection/projection.service';
import { ProjectionName } from '../../../domain/models/projection-options.model';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { map } from 'rxjs';
import { ConstellationLineSettings } from '../../../domain/models/constellation-line.model';
import { ConstalationLinesPathsService } from './constalation-lines-paths.service';

@Component({
  selector: 'g[app-constellation-lines-layer]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'constellation-lines-layer.component.html',
})
export class ConstellationLinesLayerComponent {
  private svc = inject(ConstalationLinesPathsService);
  private state = inject(SkyMapStateService);

  constellationLineSettings$ = this.state.constellationLineSettings$.pipe(map(this.scratchDashed.bind(this)));

  paths = this.svc.paths;

  scratchDashed({ style, dashSize, ...settings }: ConstellationLineSettings) {
    const dasharray = style !== 'dashed' ? null : `${dashSize} ${dashSize}`;
    return { ...settings, dasharray };
  }
}
