import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { Star } from '../../../domain/stars/star.model';

@Component({
  selector: 'g[app-star-labels-layer]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-labels-layer.component.html',
  styleUrls: ['./star-labels-layer.component.css']
})
export class StarLabelsLayerComponent {

  @Input({ required: true }) stars: Star[] = [];
  @Input({ required: true }) labelMaxMag = 2.0;
  @Input({ required: false }) radiusFn: (s: Star) => number = () => 2;



  /**
   * WAŻNE:
   * Robimy zwykłego gettera zamiast computed(),
   * bo @Input() to nie jest signal i Angular nie zintegruje nam computed()
   * automatycznie. Getter jest wywoływany przy renderze template.
   */
get labeledStars(): Star[] {
  const limit = this.labelMaxMag;
  return this.stars.filter(s => {
    // 1. nazwa jako string (jeśli to numer albo cokolwiek innego, zmieniamy na string)
    const rawName = (s as any).name;
    const nameStr = (typeof rawName === 'string')
      ? rawName
      : (rawName != null ? String(rawName) : '');

    // 2. czy mamy coś do wyświetlenia?
    if (!nameStr || nameStr.trim().length === 0) {
      return false;
    }

    // 3. czy punkt ma współrzędne ekranowe?
    if (!Array.isArray(s.__projected)) {
      return false;
    }

    // 4. czy gwiazda jest wystarczająco jasna?
    if (s.mag != null && s.mag > limit) {
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
