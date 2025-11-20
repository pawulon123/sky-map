import { Component, computed, inject, Input } from '@angular/core';
import { StarsLayerComponent } from '../layers/stars-layer/stars-layer.component';
import { AsterismsLayerComponent } from '../layers/asterisms-layer/asterisms-layer.component';
import { BoundariesLayerComponent } from '../layers/boundaries-layer/boundaries-layer.component';
import { ConstellationLinesLayerComponent } from '../layers/constellation-lines-layer/constellation-lines-layer.component';
import { CommonModule } from '@angular/common';
import { SkyMapStateService } from '../../domain/services/sky-map-state/sky-map-state.service';

@Component({
  selector: 'app-root-svg',
  imports: [
    CommonModule,
    StarsLayerComponent,
    AsterismsLayerComponent,
    BoundariesLayerComponent,
    ConstellationLinesLayerComponent /*, GridLayerComponent*/,
  ],
  templateUrl: './root-svg.component.html',
  styleUrl: './root-svg.component.css',
})
export class RootSvgComponent {
  readonly state = inject(SkyMapStateService);
  readonly projectionSettings$ = this.state.projectionSettings$;
  readonly asterismSettings$ = this.state.asterismLayerSettings$;

  @Input() showGrid = true;
  @Input() showStars = true;
  @Input() showBoundaries = true;
  @Input() showConstellationLines = true;
  @Input() showLabels = true;
  @Input() maxIntensity: number | null = null;
}
