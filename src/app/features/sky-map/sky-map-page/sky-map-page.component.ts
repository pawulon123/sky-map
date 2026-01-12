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
import { Subscription } from 'rxjs';

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
    this.state.setRefSvg(this.svg);
    this.svgRef.emit(this.state.svgRef);
    this.stateProjectionSub = this.projectionSettings$.subscribe(({ width, height, mode }) => {
      console.log(width, height);
      this.dataFromSvg.emit({ width, height });
      this.mode = mode;
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
