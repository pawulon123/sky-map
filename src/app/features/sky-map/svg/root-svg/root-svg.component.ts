import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkyMapStateService } from '../../domain/services/sky-map-state/sky-map-state.service';
import { SvgTooltipRootDirective } from '../../../../core/tooltip/tooltip.directive';
import { ReflectOnVerticalAxisDirective } from '../../common/reflect-on-vertical-axis.directive';

import { StarsLayerComponent } from '../layers/stars-layer/stars-layer.component';
import { AsterismsLayerComponent } from '../layers/asterisms-layer/asterisms-layer.component';
import { BoundariesLayerComponent } from '../layers/boundaries-layer/boundaries-layer.component';
import { ConstellationLinesLayerComponent } from '../layers/constellation-lines-layer/constellation-lines-layer.component';

import { LayersSvg } from '../../domain/models/layers-svg';
import { map, withLatestFrom } from 'rxjs';
import { RenderSettings } from '../../domain/models/render.model';
import { ProjectionSettings } from '../../domain/models/projection-options.model';
// type eventsFromCommonMenu ={ fitToWindow: () => void};

@Component({
  selector: 'app-root-svg',
  standalone: true,
  imports: [
    CommonModule,
    StarsLayerComponent,
    AsterismsLayerComponent,
    BoundariesLayerComponent,
    ConstellationLinesLayerComponent,
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

  eventsFromCommonMenu = {
    fitToWindow: ({ innerHeight, innerWidth }: Partial<RenderSettings>, { width, height }: ProjectionSettings) => {
      const toolbarH = 48;

      const maxW = innerWidth;
      const maxH = Math.max(0, innerHeight ?? 0 - toolbarH);

      const s = Math.min(maxW ?? 0 / width, maxH / height);
      return {
        innerHeight: Math.floor(height * s),
        innerWidth: Math.floor(width * s),
      };
    },

    resetToRealSize: ({ innerHeight, innerWidth }: Partial<RenderSettings>, { width, height }: ProjectionSettings) => {
      return {
        innerHeight: height,
        innerWidth: width,
      };
    },
  };
  readonly renderSettings$ = this.state.renderSettings$.pipe(
    withLatestFrom(this.projectionSettings$),

    map(([{ name, ...other }, proj]) => {
      return this.eventsFromCommonMenu[name](other, proj);
    })
  );
  @Input() showGrid = true;
  @Input() showBoundaries = true;
  @Input() showConstellationLines = true;
  @Input() showLabels = true;
  @Input() maxIntensity: number | null = null;

  // --- Sterowanie zoomem ---
  // Rodzic podaje np. "0 0 2000 1400". Jeśli puste -> fallback do projectionSettings.
  @Input() viewBox: string | null = null;

  // --- Przekazanie zdarzeń do rodzica (pewniejsze niż bąbelkowanie) ---
  @Output() svgClick = new EventEmitter<MouseEvent>();
  @Output() svgWheel = new EventEmitter<WheelEvent>();

  @ViewChild('skySvg', { static: false }) svgRef!: ElementRef<SVGSVGElement>;

  layersSvg = LayersSvg;

  ngAfterViewInit(): void {
    this.state.setRefSvg(this.svgRef);
  }

  onWheel(e: WheelEvent): void {
    // Rodzic może zdecydować czy robi preventDefault (np. tylko gdy zoomMode != 'none')
    this.svgWheel.emit(e);
  }

  onClick(e: MouseEvent): void {
    this.svgClick.emit(e);
  }
}
