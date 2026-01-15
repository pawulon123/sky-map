import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Star } from '../../../domain/models/star.model';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { LabelPlacement, LabelPlacementWithLines, StarsLayerSettings } from '../../../domain/models/stars-layer-settings.model';
import { defaultStarsSettings } from '../../../domain/default/stars';
import { LabelService } from './label.service';
import { buildLabelLines, firstLine } from './name-or-bayer';
@Component({
  selector: 'g[app-labels-layer]',
  imports: [CommonModule],
  templateUrl: './labels-layer.component.html',
  styleUrl: './labels-layer.component.css',
})
export class LabelsLayerComponent implements OnInit {
  private labelService = inject(LabelService);
  private state = inject(SkyMapStateService);

  starsSettings$ = this.state.starsLayerSettings$;

  private labelLinesFn!: (star: Star) => string[];
  settings: StarsLayerSettings = defaultStarsSettings;

  ngOnInit(): void {
    this.buildLabelLines();
  }

  private buildLabelLines(): void {
    const getLabelsSetting = () => this.state.getStarSettings().labels;
    this.labelLinesFn = buildLabelLines(firstLine)(getLabelsSetting);
  }

  getLabelLines(star: Star): string[] {
    return this.labelLinesFn(star);
  }

 computeLabelLayout(): LabelPlacementWithLines[] {
  const getLinesCached = this.getCache()
  const placements = this.labelService.computeLabelLayout(getLinesCached);
  return placements.map(p => ({
    ...p,
    lines: getLinesCached(p.star),
  }));
}
  getCache() {
    const cache = new Map<Star, string[]>();

  return (star: Star): string[] => {
    const hit = cache.get(star);
    if (hit) return hit;
    const lines = this.getLabelLines(star);
    cache.set(star, lines);
    return lines;
  };
  }

}
