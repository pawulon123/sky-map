import { ChangeDetectionStrategy, Component, inject, Input, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RenderStar } from '../../../domain/models/stars-layer-settings.model';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { LabelsLayerComponent } from '../labels-layer/labels-layer.component';
import { StarSymbolService } from './star-symbol.service';
import { ShapesStarComponent } from '../../components/shapes-star/shapes-star.component';

@Component({
  selector: 'g[app-stars-layer]',
  standalone: true,
  imports: [CommonModule, LabelsLayerComponent, ShapesStarComponent],
  templateUrl: './stars-layer.component.html',
  styleUrl: './stars-layer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarsLayerComponent {
  private starSynbolService = inject(StarSymbolService);
 
  showLabels = input<boolean>(true);

  readonly starSynbols = this.starSynbolService.starSynbols;


  trackByStar(index: number, rs: RenderStar): number {
    return index;
  }

  getTooltip(star: RenderStar): string {
    return star.star.name ?? '';
  }
}
