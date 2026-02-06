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

  private readonly parentReflect = inject(ReflectOnVerticalAxisDirective, {
    optional: true,
    skipSelf: true,
  });

  @Input('appReflectOnVerticalAxis')
  layerName: LayersSvg | null = null;

  readonly transform = computed(() => {
    if (this.parentReflect?.transform()) return null;

    const { width, mirrorX } = this.proj.settings();

    const w = Number(width);
    if (!Number.isFinite(w) || w <= 0) {
      return null;
    }
    let effectiveMirrorX = mirrorX;

    if (!effectiveMirrorX) return null;

    return `translate(${w},0) scale(-1,1)`;
  });
}
