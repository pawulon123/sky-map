import { Directive, Input, computed, inject } from '@angular/core';
import { ProjectionService } from '../domain/services/projection/projection.service';
import { LayersSvg } from '../domain/models/layers-svg';

@Directive({
  selector: 'text[appUnmirrorText]',
  standalone: true,
  host: {
    '[attr.transform]': 'transform()',
  },
})
export class UnmirrorTextDirective {
  private readonly proj = inject(ProjectionService);

  @Input('appUnmirrorText') x!: number;

  // domyślnie użyjemy warstwy labelBoundaries (żeby nie dokładać nic w komponencie)
  @Input() appUnmirrorTextLayer: LayersSvg = LayersSvg.labelBoundaries;

  readonly transform = computed(() => {
    const { mirrorX } = this.proj.settings();

    // ta sama logika co w ReflectOnVerticalAxisDirective
    let effectiveMirrorX = mirrorX;
    if (this.appUnmirrorTextLayer === LayersSvg.boundaries || this.appUnmirrorTextLayer === LayersSvg.labelBoundaries) {
      effectiveMirrorX = !effectiveMirrorX;
    }
    if (!effectiveMirrorX) return null;

    const x = Number(this.x);
    if (!Number.isFinite(x)) return null;

    return `translate(${2 * x},0) scale(-1,1)`;
  });
}
