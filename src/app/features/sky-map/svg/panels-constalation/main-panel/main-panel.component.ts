import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { map } from 'rxjs';
import { ConstellationLineSettings } from '../../../domain/models/constellation-line.model';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { PathComponent } from '../../components/path/path.component';
import { ConstellationPanelsLayoutService } from '../constellation-panels-layout.service';
import { ShapesStarComponent } from '../../components/shapes-star/shapes-star.component';
import { LabelsLayerComponent } from '../../layers/labels-layer/labels-layer.component';
import { LabelPanelsComponent } from '../label-panels/label-panels.component';

@Component({
  selector: 'g[app-constellation-panels-layer]',
  standalone: true,
  imports: [CommonModule, PathComponent, ShapesStarComponent, LabelsLayerComponent, LabelPanelsComponent],
  templateUrl: './main-panel.component.html',
})
export class ConstellationPanelsLayerComponent {
  private layoutSvc = inject(ConstellationPanelsLayoutService);
  private state = inject(SkyMapStateService);

  layout = this.layoutSvc.layout;

  constellationLineSettings$ = this.state.constellationLineSettings$.pipe(map(this.scratchDashed.bind(this)));
  starSettings$ = this.state.starsLayerSettings$;
  labelPanelSettings$ = this.state.labelPanelsSettings$;

  scratchDashed({ style, dashSize, ...settings }: ConstellationLineSettings) {
    const dasharray = style !== 'dashed' ? null : `${dashSize} ${dashSize}`;
    return { ...settings, dasharray };
  }
}
