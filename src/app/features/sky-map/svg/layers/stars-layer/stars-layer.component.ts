import { ChangeDetectionStrategy, Component, computed, inject, Input, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Star } from '../../../domain/models/star.model';
import {
  RenderStar,
  StarsLayerSettings,
  StarsSymbolsSettings,
  StarSymbolShape,
} from '../../../domain/models/stars-layer-settings.model';
import { StarsService } from '../../../domain/services/stars/stars.service';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { LabelsLayerComponent } from '../labels-layer/labels-layer.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { defaultStarsSettings } from '../../../domain/default/stars';
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
  private state = inject(SkyMapStateService);

  maxMag = input<number | null>(null);
  showLabels = input<boolean>(true);
  @Input() showStars = true;

  private readonly settingsSig = toSignal(this.state.starsLayerSettings$, {
    initialValue: defaultStarsSettings,
  });

  readonly starSynbols = this.starSynbolService.starSynbols;

  get starsSettings(): StarsLayerSettings {
    return this.settingsSig();
  }

  trackByStar(index: number, rs: RenderStar): number {
    return index;
  }

  getTooltip(star: RenderStar): string {
    return star.star.name ?? '';
  }
}
