import { AfterViewInit, Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { StarsLayerComponent } from '../layers/stars-layer/stars-layer.component';
import { AsterismsLayerComponent } from '../layers/asterisms-layer/asterisms-layer.component';
import { BoundariesLayerComponent } from '../layers/boundaries-layer/boundaries-layer.component';
import { ConstellationLinesLayerComponent } from '../layers/constellation-lines-layer/constellation-lines-layer.component';
import { CommonModule } from '@angular/common';
import { SkyMapStateService } from '../../domain/services/sky-map-state/sky-map-state.service';
import { tap } from 'rxjs/operators';
import { ProjectionSettings } from '../../domain/models/projection-options.model';
import { SvgTooltipComponent } from '../../../../core/tooltip/tooltip.component';
import { SvgTooltipRootDirective } from '../../../../core/tooltip/tooltip.directive';
import { ReflectOnVerticalAxisDirective } from '../../common/reflect-on-vertical-axis.directive';
import { LayersSvg } from '../../domain/models/layers-svg';

@Component({
  selector: 'app-root-svg',
  imports: [
    CommonModule,
    StarsLayerComponent,
    AsterismsLayerComponent,
    BoundariesLayerComponent,
    ConstellationLinesLayerComponent /*, GridLayerComponent*/,
    SvgTooltipRootDirective,
    ReflectOnVerticalAxisDirective,
  ],
  templateUrl: './root-svg.component.html',
  styleUrl: './root-svg.component.css',
})
export class RootSvgComponent implements AfterViewInit {
  readonly state = inject(SkyMapStateService);
  readonly projectionSettings$ = this.state.projectionSettings$;
  readonly asterismSettings$ = this.state.asterismLayerSettings$;

  @Input() showGrid = true;
  @Input() showStars = true;
  @Input() showBoundaries = true;
  @Input() showConstellationLines = true;
  @Input() showLabels = true;
  @Input() maxIntensity: number | null = null;

  @ViewChild('skySvg', { static: false }) svgRef!: ElementRef<SVGSVGElement>;

  layersSvg = LayersSvg;

  ngAfterViewInit(): void {
    this.state.setRefSvg(this.svgRef);
  }
}
