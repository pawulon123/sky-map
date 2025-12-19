import { Directive, Input, computed, inject } from '@angular/core';
import { ProjectionService } from '../domain/services/projection/projection.service';
import { LayersSvg } from '../domain/models/layers-svg';

@Directive({
  selector: '[appReflectOnVerticalAxis]',
  standalone: true,
  host: {
    '[attr.transform]': 'transform()',
  },
})
export class ReflectOnVerticalAxisDirective {
  private readonly proj = inject(ProjectionService);

  // Jeśli dyrektywa jest także na rodzicu, wykryj to i nie dubluj transformu.
  private readonly parentReflect = inject(ReflectOnVerticalAxisDirective, {
    optional: true,
    skipSelf: true,
  });

  @Input('appReflectOnVerticalAxis')
  layerName: LayersSvg | null = null;

  readonly transform = computed(() => {
    // 1) Nie dokładaj kolejnej transformacji, jeśli rodzic już odbija.
    if (this.parentReflect?.transform()) {
      return null;
    }

    const { width, mirrorX } = this.proj.settings();

    // 2) Zabezpieczenie na start (width bywa chwilowo undefined/NaN/0).
    const w = Number(width);
    if (!Number.isFinite(w) || w <= 0) {
      return null;
    }

    // 3) Twoja logika: boundaries + labelBoundaries mają odwrócony mirrorX
    let effectiveMirrorX = mirrorX;
    if (this.layerName === LayersSvg.boundaries || this.layerName === LayersSvg.labelBoundaries) {
      effectiveMirrorX = !effectiveMirrorX;
    }

    if (!effectiveMirrorX) return null;

    return `translate(${w},0) scale(-1,1)`;
  });
}
