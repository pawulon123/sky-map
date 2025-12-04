import { Component, inject, OnInit } from '@angular/core';
import { SkyMapLayerStarsControlsComponent } from './stars/sky-map-layer-stars-controls/sky-map-layer-stars-controls.component';
import { ProjectionControlsComponent } from './projection-controls/projection-controls.component';
import { RefreshProjectionService } from '../domain/services/projection/refresh-projection.service';
import { AsterismControlsComponent } from './asterism-controls/asterism-controls.component';
import { ConstellationLineControlsComponent } from './constellation-line-controls/constellation-line-controls.component';
import { BoundariesControllsComponent } from './boundaries-controls/boundaries-controlls/boundaries-controlls.component';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-sky-map-controls',
  imports: [
    MatExpansionModule,
    SkyMapLayerStarsControlsComponent,
    ProjectionControlsComponent,
    AsterismControlsComponent,
    ConstellationLineControlsComponent,
    BoundariesControllsComponent,
  ],
  templateUrl: './sky-map-controls.component.html',
  styleUrl: './sky-map-controls.component.css',
})
export class SkyMapControlsComponent implements OnInit {
  activePanel: 'projection' | 'stars' | 'boundaries' | 'constellationLines' | 'asterisms' = 'projection';

  setActivePanel(panel: typeof this.activePanel) {
    this.activePanel = panel;
  }

  private refreshProjectionSv = inject(RefreshProjectionService);
  ngOnInit(): void {
    this.refreshProjectionSv.loadOnceEndRefresh();
  }
}
