import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, shareReplay } from 'rxjs';
import { Star } from '../../../domain/models/star.model';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { LabelVM, StarsLayerSettings, Vm } from '../../../domain/models/stars-layer-settings.model';
import { defaultStarsSettings } from '../../../domain/default/stars';
import { LabelService } from './label.service';
import { buildLabelLines, firstLine } from './name-or-bayer';

@Component({
  selector: 'g[app-labels-layer]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './labels-layer.component.html',
  styleUrl: './labels-layer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelsLayerComponent implements OnInit {
  private labelService = inject(LabelService);
  private state = inject(SkyMapStateService);

  starsSettings$ = this.state.starsLayerSettings$;

  private labelLinesFn!: (star: Star) => string[];
  settings: StarsLayerSettings = defaultStarsSettings;

  readonly vm$ = this.starsSettings$.pipe(
    map((settings) => {
      // cache tylko na czas tego przeliczenia (żeby labelService + VM nie liczyły podwójnie)
      const cache = new Map<string, string[]>();

      const getStarKey = (s: Star) =>
        String((s as any).id ?? (s as any).hip ?? (s as any).hr ?? (s as any).name ?? JSON.stringify(s));

      const getLinesCached = (star: Star) => {
        const key = getStarKey(star);
        const hit = cache.get(key);
        if (hit) return hit;
        const lines = this.labelLinesFn(star);
        cache.set(key, lines);
        return lines;
      };

      const placements = this.labelService.computeLabelLayout(getLinesCached);

      const labels: LabelVM[] = placements.map((p) => ({
        ...p,
        lines: getLinesCached(p.star),
      }));

      const vm: Vm = { settings, labels };
      return vm;
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  ngOnInit(): void {
    this.buildLabelLines();
  }

  private buildLabelLines(): void {
    const getLabelsSetting = () => this.state.getStarSettings().labels;
    this.labelLinesFn = buildLabelLines(firstLine)(getLabelsSetting);
  }

  trackByLabel = (_: number, l: LabelVM) => (l.star as any).id ?? (l.star as any).hip ?? l.star;
}
