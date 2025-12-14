import { computed, inject, Injectable, Signal } from '@angular/core';
import { ProjectionService } from '../projection/projection.service';

@Injectable({ providedIn: 'root' })
export class SelectedIdService {
  private proj = inject(ProjectionService);

  readonly selectedIdsSet: Signal<Set<string>> = computed(() => {
    const selected = this.proj.settings().selected;
    return new Set(selected);
  });

  filter<T extends { constelationId: string }>(arr: T[]): T[] {
    const allowed = this.selectedIdsSet();
    if (allowed.size === 0) return [];
    return arr.filter(({ constelationId }) => allowed.has(constelationId));
  }
}
