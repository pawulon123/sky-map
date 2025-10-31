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
  private svc  = inject(StarsService);

  show       = input<boolean>(true);
  showLabels = input<boolean>(false);
  maxMag     = input<number | null>(null); // można podać z rodzica np. [maxMag]="6.5"

  /**
   * Synchronizacja:
   * - ładujemy gwiazdy tylko raz
   * - za każdym razem gdy coś w projekcji się zmieni (np. zoom, width, itp.),
   *   przeliczamy __projected JUŻ z odbiciem lustrzanym.
   */
  private _sync = effect(async () => {
    await this.svc.loadOnce();

    // funkcja projekcji RA/Dec -> [x,y] BEZ LUSTRA
    const projFn = (lon: number, lat: number) => this.proj.projectRaDec(lon, lat);

    // przekazujemy także aktualną szerokość SVG, żeby serwis sam zrobił mirror
    const w = this.proj.width();

    this.svc.updateProjection(projFn, w);
  });

  /**
   * Gwiazdy gotowe do rysowania:
   * - muszą mieć __projected (czyli nie null)
   * - opcjonalnie filtr po jasności (maxMag)
   * - sortujemy wg jasności (jaśniejsze najpierw = większe kropki "nad" resztą)
   */
  stars = computed<Star[]>(() => {
    const dd   = this.svc.data();
    const all  = dd.stars ?? [];

    // odrzuć gwiazdy, które nie dostały współrzędnych (np. są poza polem projekcji)
    let visible = all.filter(s => Array.isArray(s.__projected));

    // filtr magnitudo jeśli ktoś ustawił maxMag
    const limit = this.maxMag();
    if (limit != null) {
      visible = visible.filter(s => s.mag == null || s.mag <= limit);
    }

    // sort po jasności: mniejsze mag -> wcześniej
    return [...visible].sort((a, b) => (a.mag ?? 99) - (b.mag ?? 99));
  });

  /** promień kropki zależny od magnitudo */
  radius(s: Star, rMin = 0.2, rMax = 2.8): number {
    const mag = s.mag;
    const clamped = Math.max(-1.5, Math.min(8, mag ?? 6));
    const t = (8 - (clamped + 1.5)) / 9.5;
    return rMin + t * (rMax - rMin);
  }

  /** Pozycja etykiety: teraz NIE robimy już lustra, bo __projected jest już odbite */
  labelX(s: Star): number {
    const p = s.__projected ?? [0, 0];
    return p[0] + 2; // lekko w prawo od kropki
  }

  labelY(s: Star): number {
    const p = s.__projected ?? [0, 0];
    return p[1] - (this.radius(s) + 2); // lekko nad kropką
  }
}
