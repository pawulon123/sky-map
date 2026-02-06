import { Component, inject } from '@angular/core';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { CommonModule } from '@angular/common';
import { LabelBoundariesService } from './label-boundaries.service';
import { TaxtPolinesComponent } from '../../components/text-polines/text-polines.component';
import { LayersSvg } from '../../../domain/models/layers-svg';

@Component({
  selector: 'g[app-label-boundaries-layer]',
  imports: [CommonModule, TaxtPolinesComponent],
  standalone: true,
  templateUrl: './label-boundaries-layer.component.html',
  styleUrl: './label-boundaries-layer.component.css',
})
export class LabelBoundariesLayerComponent {
  private state = inject(SkyMapStateService);
  layersSvg = LayersSvg;
  viewBoxWidth = this.state.renderSettings$;

  private labelBoundariesService = inject(LabelBoundariesService);
  labels = this.labelBoundariesService.labels;

  boundariesSettings$ = this.state.boundariesLayerSettings$;
}
