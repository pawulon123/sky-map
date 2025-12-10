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
  private proj = inject(ProjectionService);

  @Input('appReflectOnVerticalAxis')
  layerName: LayersSvg | null = null;

  readonly transform = computed(() => {
    const { width, mirrorX } = this.proj.settings();
    let effectiveMirrorX = mirrorX;
    if (this.layerName === LayersSvg.boundaries) {
      effectiveMirrorX = !effectiveMirrorX;
    }

    if (!effectiveMirrorX) {
      return null;
    }

    return `translate(${width},0) scale(-1,1)`;
  });
}
