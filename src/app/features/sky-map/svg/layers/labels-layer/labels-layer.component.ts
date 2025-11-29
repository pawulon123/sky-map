import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Star } from '../../../domain/models/star.model';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { LabelPlacement, StarsLayerSettings } from '../../../domain/models/stars-layer-settings.model';
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
  @Input({ required: false }) radiusFn: (s: Star) => number = () => 2;

  private labelService = inject(LabelService);
  private state = inject(SkyMapStateService);

  starsSettings$ = this.state.starsLayerSettings$;

  private labelLinesFn!: (star: Star) => string[];
  settings: StarsLayerSettings = defaultStarsSettings;

  ngOnInit(): void {
    this.buildLabelLines();
  }

  private buildLabelLines(): void {
    const settings = this.state.getStarSettings().labels;
    this.labelLinesFn = buildLabelLines(firstLine)(settings);
  }

  getLabelLines(star: Star): string[] {
    return this.labelLinesFn(star);
  }

  computeLabelLayout(): LabelPlacement[] {
    return this.labelService.computeLabelLayout(this.getLabelLines.bind(this));
  }
}
