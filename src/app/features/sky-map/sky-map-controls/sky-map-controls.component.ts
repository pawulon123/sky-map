import { Component, inject, OnInit } from '@angular/core';
import { StarsSymbolControlsComponent } from './stars/stars-symbol-controls/stars-symbol-controls.component';
import { StarsLabelControlsComponent } from './stars/stars-label-controls/stars-label-controls.component';
import { SkyMapLayerStarsControlsComponent } from './stars/sky-map-layer-stars-controls/sky-map-layer-stars-controls.component';
import { ProjectionControlsComponent } from './projection-controls/projection-controls.component';
import { RefreshProjectionService } from '../domain/services/projection/refresh-projection.service';
import { BoundariesControlsComponent } from './boundaries-controls/boundaries-controls.component';
import { AsterismControlsComponent } from './asterism-controls/asterism-controls.component';
import { ConstellationLineControlsComponent } from './constellation-line-controls/constellation-line-controls.component';

@Component({
  selector: 'app-sky-map-controls',
  imports: [
    SkyMapLayerStarsControlsComponent,
    ProjectionControlsComponent,
    BoundariesControlsComponent,
    AsterismControlsComponent,
    ConstellationLineControlsComponent,
  ],
  templateUrl: './sky-map-controls.component.html',
  styleUrl: './sky-map-controls.component.css',
})
export class SkyMapControlsComponent implements OnInit {
  private refreshProjectionSv = inject(RefreshProjectionService);
  ngOnInit(): void {
    this.refreshProjectionSv.loadOnceEndRefresh();
  }
}
