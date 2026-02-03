import { Injectable, inject, computed } from '@angular/core';
import {
  LabelBoundary,
  Boundary,
  Segments,
  ScreenPoint,
  BoundaryLanguage,
} from '../../../domain/models/boundary.model';
import { BoundariesService } from '../../../domain/services/boundaries/boundaries.service';
import { ProjectionService } from '../../../domain/services/projection/projection.service';
import { SelectedIdService } from '../../../domain/services/sky-map-state/allowed-ids-policy.service';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { getFullNameConstelation } from '../../../common/get-full-name-constelation';

@Injectable({ providedIn: 'root' })
export class LabelBoundariesService {
  private readonly boundariesSv = inject(BoundariesService);
  private readonly selectedId = inject(SelectedIdService);
  private readonly state = inject(SkyMapStateService);
  private readonly proj = inject(ProjectionService);

  labels = computed<LabelBoundary[]>(() => this.createLabels());

  private createLabels(): LabelBoundary[] {
    const boundaries = this.getBoundaries();
    if (!boundaries.length) return [];

    const filtered = this.filterBoundaries(boundaries);
    const ctx = this.getLabelContext();

    return filtered.map((b) => this.boundaryToLabel(b, ctx)).filter(this.isLabelBoundary);
  }

  private getBoundaries(): Boundary[] {
    const { boundaries = [] } = this.boundariesSv.data();
    return boundaries;
  }

  private filterBoundaries(boundaries: Boundary[]): Boundary[] {
    return this.selectedId.filter(boundaries as unknown as any[]) as Boundary[];
  }

  private getLabelContext(): BoundaryLanguage {
    return this.state.getBoundariesSettings().labels.language;
  }

  private boundaryToLabel(boundary: Boundary, language: BoundaryLanguage): LabelBoundary | null {
    const segs = boundary.segments ?? [];
    if (!segs.length) return null;

    const centroid = this.computeCentroidOnScreen(segs);
    if (!centroid) return null;

    const [x, y] = centroid;
    return {
      x,
      y,
      abbrev: boundary.abbrev,
      name: getFullNameConstelation(boundary.abbrev)[language],
    };
  }

  private computeCentroidOnScreen(segs: Segments): ScreenPoint | null {
    let sumX = 0;
    let sumY = 0;
    let count = 0;

    for (const seg of segs) {
      for (const [ra, dec] of seg) {
        const p = this.proj.getProjectionByLonLat(ra, dec) as ScreenPoint | null;
        if (!p) continue;
        sumX += p[0];
        sumY += p[1];
        count++;
      }
    }

    if (!count) return null;
    return [sumX / count, sumY / count];
  }

  private isLabelBoundary(v: LabelBoundary | null): v is LabelBoundary {
    return v !== null;
  }
}
