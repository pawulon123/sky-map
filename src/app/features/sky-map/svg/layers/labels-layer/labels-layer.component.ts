import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Star } from '../../../domain/models/star.model';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import {
  StarsLayerSettings,
  LabelPlacementWithLines,
  StarsLabelsSettings,
} from '../../../domain/models/stars-layer-settings.model';
import { defaultStarsSettings } from '../../../domain/default/stars';
import { buildLabelLines, firstLine } from './name-or-bayer';
import { AdaptiveLabelsLayoutService } from '../../panels-constalation/label-star/adaptive-labels-layout.service';
import { RenderPanelStar } from '../../../domain/models/panels.model';
import { TaxtPolinesComponent } from '../../components/taxt-polines/taxt-polines.component';

@Component({
  selector: 'g[app-labels-layer]',
  imports: [CommonModule, TaxtPolinesComponent],
  templateUrl: './labels-layer.component.html',
  styleUrl: './labels-layer.component.css',
})
export class LabelsLayerComponent implements OnInit {
  private labelsLayout = inject(AdaptiveLabelsLayoutService);
  private state = inject(SkyMapStateService);

  starsSettings$ = this.state.starsLayerSettings$;
  @Input() stars: RenderPanelStar[] = [];

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
    const getLinesCached = this.getCache();
    const placements = this.labelsLayout.computeLabelLayout(getLinesCached);

    return placements.map((p) => ({
      ...p,
      lines: getLinesCached(p.star),
    }));
  }

  private getCache() {
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
