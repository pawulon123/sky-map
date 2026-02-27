import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterOutlet } from '@angular/router';
import { Portal, PortalModule } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';
import { PanelHeaderPortalService } from './panel-header-portal.service';
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
    MatCheckboxModule,
    RouterOutlet,
    PortalModule,
  ],
  templateUrl: './sky-map-controls.component.html',
  styleUrl: './sky-map-controls.component.css',
})
export class SkyMapControlsComponent implements OnInit, OnDestroy {
  activePanel: 'projection' | 'stars' | 'boundaries' | 'constellationLines' | 'asterisms' = 'projection';
  private state = inject(SkyMapStateService);
  private refreshProjectionSv = inject(RefreshProjectionService);
  projectionSettings = this.state.projectionSettings$;
  projectionEnabled: unknown;

  private sub = new Subscription();

  topbarPortal: Portal<any> | null = null;
  starsPortal: Portal<any> | null = null;

  private header = inject(PanelHeaderPortalService);

  projectionHeaderPortal$ = this.header.portalFor('projection');
  starsHeaderPortal$ = this.header.portalFor('stars');
  starsLabelHeaderPortal$ = this.header.portalFor('starsLabel');
  boundariesLineHeaderPortal$ = this.header.portalFor('boundariesLine');
  boundariesLabelHeaderPortal$ = this.header.portalFor('boundariesLabel');
  panelLabelHeaderPortal$ = this.header.portalFor('panelLabel');
  constellationLinesHeaderPortal$ = this.header.portalFor('constellationLines');

  ngOnInit(): void {
    this.refreshProjectionSv.loadOnceEndRefresh();
  }
  setActivePanel(panel: typeof this.activePanel) {
    this.activePanel = panel;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
