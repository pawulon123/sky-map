import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { map } from 'rxjs';
import { ConstellationLineSettings } from '../../../domain/models/constellation-line.model';

import { PathComponent } from '../../components/path/path.component';
import { ConstalationLinesPathsService } from './constalation-lines-paths.service';

@Component({
  selector: 'g[app-constellation-lines-layer]',
  standalone: true,
  imports: [CommonModule, PathComponent],
  templateUrl: 'constellation-lines-layer.component.html',
})
export class ConstellationLinesLayerComponent {
  private layer = inject(ConstalationLinesPathsService);
  private state = inject(SkyMapStateService);

  constellationLineSettings$ = this.state.constellationLineSettings$.pipe(map(this.scratchDashed.bind(this)));

  paths = this.layer.data;

  scratchDashed({ style, dashSize, ...settings }: ConstellationLineSettings) {
    const dasharray = style !== 'dashed' ? null : `${dashSize} ${dashSize}`;
    return { ...settings, dasharray };
  }
}
