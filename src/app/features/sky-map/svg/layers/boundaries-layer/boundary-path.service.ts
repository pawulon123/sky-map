import { computed, inject, Injectable, Signal } from '@angular/core';
import { ProjectionService } from '../../../domain/services/projection/projection.service';
import { Boundary, BoundaryPath, ChunkWithBoundary, ScreenChunk } from '../../../domain/models/boundary.model';
import { segmentToScreenChunks } from './segment-to-screen-chunks';
import { BoundariesService } from '../../../domain/services/boundaries/boundaries.service';
import { SelectedIdService } from '../../../domain/services/sky-map-state/allowed-ids-policy.service';

@Injectable({ providedIn: 'root' })
export class BoundaryPathService {
  private proj = inject(ProjectionService);
  private boundariesSv = inject(BoundariesService);
  private selectedId = inject(SelectedIdService);

  constructor() {
    this.boundariesSv.loadOnce();
  }

  readonly pathsRaw: Signal<BoundaryPath[]> = computed(() => {
    const { boundaries = [] } = this.boundariesSv.data();
    return this.buildPaths(boundaries);
  });

  /** filtruj boundaries wcześnie */
  readonly paths: Signal<BoundaryPath[]> = computed(() => {
    const { boundaries = [] } = this.boundariesSv.data();

    const filteredBoundaries = this.selectedId.filter(boundaries);

    return this.buildPaths(filteredBoundaries);
  });

  private buildPaths(boundaries: Boundary[]): BoundaryPath[] {
    return this.getFlatBoundary(boundaries)
      .map(({ chunk, boundary }) => {
        const d = this.chunkToPathD(chunk);
        return d ? { d, boundary } : null;
      })
      .filter((p): p is BoundaryPath => p !== null);
  }

  private getFlatBoundary(boundaries: Boundary[]): ChunkWithBoundary[] {
    return boundaries.flatMap((boundary) =>
      (boundary.segments ?? []).flatMap((segRaDec) =>
        segmentToScreenChunks(segRaDec, this.proj.settings, this.proj.getProjectionByLonLat.bind(this.proj)).map(
          (chunk) => ({ chunk, boundary })
        )
      )
    );
  }

  private chunkToPathD(chunkXY: ScreenChunk): string {
    if (chunkXY.length < 2) return '';
    const [firstX, firstY] = chunkXY[0];
    let d = `M${firstX},${firstY}`;
    for (let i = 1; i < chunkXY.length; i++) {
      const [x, y] = chunkXY[i];
      d += `L${x},${y}`;
    }
    return d;
  }
}
