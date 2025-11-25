import { AfterViewInit, Component, EventEmitter, inject, OnDestroy, Output } from '@angular/core';
import { SkyMapControlsComponent } from '../sky-map-controls/sky-map-controls.component';
import { SkyMapSvgComponent } from '../sky-map-svg/sky-map-svg.component';
import { SkyMapStateService } from '../domain/services/sky-map-state/sky-map-state.service';
import { SvgData } from '../../../core/common/svg-data';
import { Subscription } from 'rxjs';
import { MatSidenavModule, MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sky-map-page',
  imports: [
    SkyMapSvgComponent,
    SkyMapControlsComponent,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    MatIconModule,
  ],
  templateUrl: './sky-map-page.component.html',
  styleUrl: './sky-map-page.component.css',
  standalone: true,
})
export class SkyMapPageComponent implements AfterViewInit, OnDestroy {
  private stateProjectionSub!: Subscription;
  readonly state = inject(SkyMapStateService);
  readonly projectionSettings$ = this.state.projectionSettings$;

  @Output() svgData = new EventEmitter<SvgData>();

  ngAfterViewInit(): void {
    this.stateProjectionSub = this.subscriptionProjection();
  }

  private subscriptionProjection(): Subscription {
    return this.projectionSettings$.subscribe(this.sendSvgData.bind(this));
  }

  private sendSvgData({ width, height }: Partial<SvgData>): void {
    const svgRef = this.state.svgRef;
    this.svgData.emit({ width, height, svgRef });
  }

  ngOnDestroy(): void {
    this.stateProjectionSub.unsubscribe();
  }
}
