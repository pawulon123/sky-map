import { AfterViewInit, Component, EventEmitter, inject, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';

import { SkyMapControlsComponent } from '../sky-map-controls/sky-map-controls.component';
import { SkyMapStateService } from '../domain/services/sky-map-state/sky-map-state.service';
import { SvgData, SvgRef } from '../../../core/common/svg-data';
import { RootSvgComponent } from '../svg/root-svg/root-svg.component';
import { PanelsConstellationComponent } from '../svg/panels-constalation/panels-constalation.component';

@Component({
  selector: 'app-sky-map-page',
  standalone: true,
  imports: [
    CommonModule,
    SkyMapControlsComponent,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    MatIconModule,
    RootSvgComponent,
    PanelsConstellationComponent,
  ],
  templateUrl: './sky-map-page.component.html',
  styleUrl: './sky-map-page.component.css',
})
export class SkyMapPageComponent implements AfterViewInit, OnDestroy {
  private stateProjectionSub?: Subscription;

  readonly state = inject(SkyMapStateService);
  readonly projectionSettings$ = this.state.projectionSettings$;

  isMenuOpen = false;

  @Output() dataFromSvg = new EventEmitter<SvgData>();
  @Output() svgRef = new EventEmitter<SvgRef>();
  isPanel = true;
  @Input() set eventFromCommonMenu(ev: any) {
    this.state.updateRender(ev);
  }

  ngAfterViewInit(): void {
    this.svgRef.emit(this.state.svgRef);
    this.stateProjectionSub = this.projectionSettings$.subscribe(({ width, height }) => {
      this.dataFromSvg.emit({ width, height });
    });
  }

  openMenu() {
    this.isMenuOpen = true;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  ngOnDestroy(): void {
    this.stateProjectionSub?.unsubscribe();
  }
}
