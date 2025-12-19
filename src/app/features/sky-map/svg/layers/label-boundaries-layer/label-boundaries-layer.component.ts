import { Component, computed, inject } from '@angular/core';
import { ProjectionService } from '../../../domain/services/projection/projection.service';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { CommonModule } from '@angular/common';
import { LabelBoundariesService } from './label-boundaries.service';
import { UnmirrorTextDirective } from '../../../common/keep-text-readableIn-mirror.directive';

@Component({
  selector: 'g[app-label-boundaries-layer]',
  imports: [CommonModule, UnmirrorTextDirective],
  standalone: true,
  templateUrl: './label-boundaries-layer.component.html',
  styleUrl: './label-boundaries-layer.component.css',
})
export class LabelBoundariesLayerComponent {
  private state = inject(SkyMapStateService);
  private proj = inject(ProjectionService);
  private labelBoundariesService = inject(LabelBoundariesService);
  labels = this.labelBoundariesService.labels;

  boundariesSettings$ = this.state.boundariesLayerSettings$;
}
