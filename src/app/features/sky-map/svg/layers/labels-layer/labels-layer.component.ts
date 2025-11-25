import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Star } from '../../../domain/models/star.model';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { LabelPlacement, StarsLabelsSettings } from '../../../domain/models/stars-layer-settings.model';
import { hasNameOrBayer, projected } from './helpers';
import { buildLabelLines, firstLine } from './name-or-bayer';
import { computeLabelLayout } from './compute-label-layou';

@Component({
  selector: 'g[app-labels-layer]',
  imports: [CommonModule],
  templateUrl: './labels-layer.component.html',
  styleUrl: './labels-layer.component.css',
})
export class LabelsLayerComponent {
  @Input({ required: true }) stars: Star[] = [];
  @Input({ required: false }) radiusFn: (s: Star) => number = () => 2;

  private state = inject(SkyMapStateService);
  starsSettings$ = this.state.starsLayerSettings$;

  private readonly labelLines = buildLabelLines(firstLine);

  get labeledStars(): Star[] {
    return this.stars.filter((s) => hasNameOrBayer(s)).filter((s) => projected(s));
  }

  getLabelLines(star: Star, settings: StarsLabelsSettings): string[] {
    return this.labelLines(star, settings);
  }

  computeLabelLayout(settings: StarsLabelsSettings): LabelPlacement[] {
    return computeLabelLayout(settings, this.labeledStars, this.getLabelLines.bind(this));
  }
}
