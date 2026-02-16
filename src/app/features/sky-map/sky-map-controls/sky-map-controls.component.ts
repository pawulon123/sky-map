import { Component, inject, OnInit } from '@angular/core';
import { SkyMapLayerStarsControlsComponent } from './stars/sky-map-layer-stars-controls/sky-map-layer-stars-controls.component';
import { ProjectionControlsComponent } from './projection-controls/projection-controls.component';
import { RefreshProjectionService } from '../domain/services/projection/refresh-projection.service';
import { AsterismControlsComponent } from './asterism-controls/asterism-controls.component';
import { ConstellationLineControlsComponent } from './constellation-line-controls/constellation-line-controls.component';
import { BoundariesControllsComponent } from './boundaries-controls/boundaries-controlls/boundaries-controlls.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { SkyMapStateService } from '../domain/services/sky-map-state/sky-map-state.service';
import { CommonModule } from '@angular/common';
import { PanelsLabelComponent } from './panels-label/panels-label.component';

@Component({
  selector: 'app-sky-map-controls',
  imports: [
    CommonModule,
    MatExpansionModule,
    SkyMapLayerStarsControlsComponent,
    ProjectionControlsComponent,
    // AsterismControlsComponent,
    ConstellationLineControlsComponent,
    BoundariesControllsComponent,
    PanelsLabelComponent,
  ],
  templateUrl: './sky-map-controls.component.html',
  styleUrl: './sky-map-controls.component.css',
})
export class SkyMapControlsComponent implements OnInit {
  activePanel: 'projection' | 'stars' | 'boundaries' | 'constellationLines' | 'asterisms' = 'projection';
  private state = inject(SkyMapStateService);
  projectionSettings = this.state.projectionSettings$;
  ngOnInit(): void {
    this.refreshProjectionSv.loadOnceEndRefresh();
  }
  setActivePanel(panel: typeof this.activePanel) {
    this.activePanel = panel;
  }

  private refreshProjectionSv = inject(RefreshProjectionService);
}
