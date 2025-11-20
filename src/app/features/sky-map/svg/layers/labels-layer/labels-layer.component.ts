import { Component, inject, Input } from '@angular/core';
import { Star } from '../../../domain/models/star.model';
import { CommonModule } from '@angular/common';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { isInRange } from '../../../../../core/utils/utils-function';

@Component({
  selector: 'g[app-labels-layer]',
  imports: [CommonModule],
  templateUrl: './labels-layer.component.html',
  styleUrl: './labels-layer.component.css',
})
export class LabelsLayerComponent {
  @Input({ required: true }) stars: Star[] = [];
  @Input({ required: false }) radiusFn: (s: Star) => number = () => 2;

  isInRange: (value: number, [min, max]: [number, number]) => boolean = isInRange;
  private state = inject(SkyMapStateService);
  starsSettings$ = this.state.starsLayerSettings$;

  get labeledStars(): Star[] {
    return this.stars.filter((s) => {
      // 1. nazwa jako string (jeśli to numer albo cokolwiek innego, zmieniamy na string)
      const rawName = (s as any).name;
      const nameStr = typeof rawName === 'string' ? rawName : rawName != null ? String(rawName) : '';

      // 2. czy mamy coś do wyświetlenia?
      if (!nameStr || nameStr.trim().length === 0) {
        return false;
      }

      // 3. czy punkt ma współrzędne ekranowe?
      if (!Array.isArray(s.__projected)) {
        return false;
      }

      return true;
    });
  }

  labelX(s: Star): number {
    const p = s.__projected ?? [0, 0];
    return p[0] + 3;
  }

  labelY(s: Star): number {
    const p = s.__projected ?? [0, 0];
    return p[1] - (this.radiusFn(s) + 2);
  }
}
