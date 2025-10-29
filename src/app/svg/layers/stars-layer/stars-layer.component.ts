import { CommonModule } from '@angular/common';
import { Component, computed, input, inject, effect } from '@angular/core';
import { ProjectionService } from '../../../services/projection.service';
import { StarsService } from '../../../services/stars.service';
import { Star } from '../../../domain/stars/star.model';

@Component({
  selector: 'g[app-stars-layer]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stars-layer.component.html',
  styleUrls: ['./stars-layer.component.css']
 
})
export class StarsLayerComponent {
  private proj = inject(ProjectionService);
  private svc = inject(StarsService);

  show       = input<boolean>(true);
  showLabels = input<boolean>(false);
  maxMag     = input<number | null>(null);

  // ładowanie danych + projekcja gdy zmienia się rozmiar/projekcja
  private _sync = effect(async () => {
    await this.svc.loadOnce();
    this.svc.updateProjection((lon, lat) => this.proj.projectRaDec(lon, lat));
  });

  // odfiltrowane & zprojekowane gwiazdy
  stars = computed<Star[]>(() => {
    const dd = this.svc.data();
    const maxM = this.maxMag();
    const all = dd.stars ?? [];
    const filtered = (maxM == null)
      ? all
      : all.filter(s => s.mag == null || s.mag <= maxM);
    // UWAGA: projekcja (px,py) już jest w __projected — ale jeśli chcesz
    // przeliczać tu, zostawiamy gotową funkcję; teraz tylko sortowanie:
    return [...filtered].sort((a, b) => (a.mag ?? 99) - (b.mag ?? 99));
  });

  // promień kropki z jasności
  radius(s: Star, rMin = 0.2, rMax = 2.8): number {
    const mag = s.mag;
    const clamped = Math.max(-1.5, Math.min(8, mag ?? 6));
    const t = (8 - (clamped + 1.5)) / 9.5;
    return rMin + t * (rMax - rMin);
  }

  // pozycja etykiety – lustrzane odbicie względem osi pionowej
 // src/app/svg/layers/stars-layer/stars-layer.component.ts
labelX(s: Star): number {
  const p = s.__projected ?? [0, 0];
  const [x] = p;
  return this.proj.width() - x;
}

  labelY(s: Star): number {
    const p = s.__projected ?? [0, 0];
    return p[1] - (this.radius(s) + 2);
  }
}
