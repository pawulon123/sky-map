import { Component, computed, inject } from '@angular/core';
import { BoundariesService } from '../../../domain/services/boundaries/boundaries.service';
import { ProjectionService } from '../../../domain/services/projection/projection.service';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { createBoundaryName } from '../boundaries-layer/create-boundary-name';
import { CommonModule } from '@angular/common';
import { SelectedIdService } from '../../../domain/services/sky-map-state/allowed-ids-policy.service';

@Component({
  selector: 'g[app-label-boundaries-layer]',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './label-boundaries-layer.component.html',
  styleUrl: './label-boundaries-layer.component.css',
  host: {
    '[attr.transform]': 'labelHostTransform()',
  },
})
export class LabelBoundariesLayerComponent {
  private boundariesSv = inject(BoundariesService);
  private state = inject(SkyMapStateService);
  private proj = inject(ProjectionService);
  private selectedId = inject(SelectedIdService);

  boundariesSettings$ = this.state.boundariesLayerSettings$;
  labelHostTransform = computed(() => {
    const { mirrorX } = this.proj.settings();
    const applyMirror = !mirrorX;

    if (!applyMirror) return null;
    return 'scale(-1,1)';
  });

  labels = computed(() => {
    const { boundaries = [] } = this.boundariesSv.data();
    if (!boundaries.length) return [];

    const filteredBoundaries = this.selectedId.filter(boundaries);

    const { mirrorX } = this.proj.settings();
    const applyMirror = !mirrorX;
    const language = this.state.getBoundariesSettings().labels.language;

    return filteredBoundaries
      .map((boundary) => {
        const segs = boundary.segments ?? [];
        if (!segs.length) return null;

        let sumX = 0;
        let sumY = 0;
        let count = 0;

        // zbierz wszystkie punkty granicy w przestrzeni EKRANU
        for (const seg of segs) {
          for (const [ra, dec] of seg) {
            const p = this.proj.getProjectionByLonLat(ra, dec);
            if (!p) continue;
            const [px, py] = p;
            sumX += px;
            sumY += py;
            count++;
          }
        }

        if (!count) return null;

        let cx = sumX / count;
        const cy = sumY / count;

        if (applyMirror) {
          cx = -cx;
        }

        return {
          x: cx,
          y: cy,
          abbrev: boundary.abbrev,
          name: createBoundaryName(boundary.abbrev)[language],
        };
      })
      .filter((v): v is { x: number; y: number; abbrev: string; name: string } => !!v);
  });
}
