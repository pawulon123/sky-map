import { CommonModule } from '@angular/common';
import { Component, computed, input, inject } from '@angular/core';
import { ProjectionService } from '../../../services/projection.service';
import { StarsService } from '../../../services/stars.service';
import { Star } from '../../../domain/stars/star.model';
import { StarLabelsLayerComponent } from '../star-labels-layer/star-labels-layer.component';

@Component({
  selector: 'g[app-stars-layer]',
  standalone: true,
  imports: [CommonModule, StarLabelsLayerComponent],
  templateUrl: './stars-layer.component.html',
  styleUrls: ['./stars-layer.component.css']
})
export class StarsLayerComponent {
  private proj = inject(ProjectionService);
  private svc  = inject(StarsService);

  show        = input<boolean>(true);
  maxMag      = input<number | null>(null);
  showLabels  = input<boolean>(true);
  labelMaxMag = input<number>(2.0);

  // dane gotowe do rysowania (po reprojectStars w AppComponent)
  stars = computed<Star[]>(() => {
    const all = this.svc.data().stars ?? [];

    // pokazuj tylko gwiazdy które mają wyliczone __projected = [x,y]
    let visible = all.filter(s => Array.isArray(s.__projected));

    const limit = this.maxMag();
    if (limit != null) {
      visible = visible.filter(s => s.mag == null || s.mag <= limit);
    }

    // sort wg jasności
    return [...visible].sort((a, b) => (a.mag ?? 99) - (b.mag ?? 99));
  });

  radius(s: Star, rMin = 0.2, rMax = 2.8): number {
    const mag = s.mag;
    const clamped = Math.max(-1.5, Math.min(8, mag ?? 6));
    const t = (8 - (clamped + 1.5)) / 9.5;
    return rMin + t * (rMax - rMin);
  }

  starCx(s: Star): number {
    const p = s.__projected ?? [0, 0];
    return p[0];
  }

  starCy(s: Star): number {
    const p = s.__projected ?? [0, 0];
    return p[1];
  }
}
