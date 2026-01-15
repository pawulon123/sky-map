import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { distinctUntilChanged, map, Subscription, tap } from 'rxjs';

import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';

import { SkyMapControlsComponent } from '../sky-map-controls/sky-map-controls.component';
import { SkyMapStateService } from '../domain/services/sky-map-state/sky-map-state.service';
import { SvgData, SvgRef } from '../../../core/common/svg-data';
import { RootSvgComponent } from '../svg/root-svg/root-svg.component';
import { PanelsConstellationComponent } from '../svg/panels-constalation/panels-constalation.component';
import { ModeProjection } from '../domain/models/projection-options.model';
import { defaultProjectionSettings } from '../domain/default/projection';
import { SvgTooltipRootDirective } from '../../../core/tooltip/tooltip.directive';
import { ConstellationPanelsLayoutService } from '../svg/panels-constalation/constellation-panels-layout.service';
import { coputedWidthHeight } from './coputed-width-height';

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
    SvgTooltipRootDirective,
  ],
  templateUrl: './sky-map-page.component.html',
  styleUrl: './sky-map-page.component.css',
})
export class SkyMapPageComponent implements AfterViewInit, OnDestroy {
  private stateProjectionSub?: Subscription;

  readonly state = inject(SkyMapStateService);
  readonly projectionSettings$ = this.state.projectionSettings$;
  isMenuOpen = false;
  @ViewChild('svg', { static: false }) svg!: ElementRef<SVGSVGElement>;
  @Output() dataFromSvg = new EventEmitter<SvgData>();
  @Output() svgRef = new EventEmitter<SvgRef>();
  mode: ModeProjection = defaultProjectionSettings.mode;
  @Input() set eventFromCommonMenu(ev: any) {
    this.state.updateRender(ev);
  }

  ngAfterViewInit(): void {
    this.sendSvg();
    this.sendProjectionProps();
  }


sendProjectionProps() {
  this.stateProjectionSub = this.projectionSettings$.pipe(
    map(s => {
      const { width, height } = coputedWidthHeight(s);
      return { mode: s.mode, width, height };
    }),
    distinctUntilChanged((a, b) =>
      a.mode === b.mode &&
      a.width === b.width &&
      a.height === b.height
    )
  )
  .subscribe(({ mode, width, height }) => {
    this.mode = mode; 
    this.dataFromSvg.emit({ width, height });
  });
}

  sendSvg() {
    this.state.setRefSvg(this.svg);
    this.svgRef.emit(this.state.svgRef);
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
