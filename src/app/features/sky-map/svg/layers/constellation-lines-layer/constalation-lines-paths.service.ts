import { computed, inject, Injectable } from '@angular/core';
import { ProjectionName } from '../../../domain/models/projection-options.model';
import { ConstellationLinesService } from '../../../domain/services/constellation-lines/constellation-lines.service';
import { ProjectionService } from '../../../domain/services/projection/projection.service';
import { LonDec, RaDec, Acc } from '../../../domain/models/constellation-line.model';

@Injectable({
  providedIn: 'root',
})
export class ConstalationLinesPathsService {
  private svc = inject(ConstellationLinesService);
  private proj = inject(ProjectionService);

  constructor() {
    this.svc.loadOnce();
  }

  readonly paths = computed(() => {
    const projectionName = this.proj.settings().projectionName as ProjectionName;
    const items = this.svc.data().items ?? [];

    return items
      .flatMap((c) => c.segments ?? []) // wszystkie segmenty
      .flatMap((seg) => this.splitByDateline(projectionName, seg)) // segmenty pocięte na kawałki
      .map((chunk) => this.makePath(chunk)) // zamiana na d-string
      .filter((d): d is string => !!d); // odrzucenie pustych
  });

  private makePath(pts: LonDec[]): string {
    if (!pts.length) return '';

    const xy = pts.map(([lon, dec]) => this.proj.getProjectionByLonLat(lon, dec) as [number, number]);

    // Mx0,y0 Lx1,y1 Lx2,y2 ...
    return xy.map(([x, y], index) => (index === 0 ? `M${x},${y}` : `L${x},${y}`)).join('');
  }

  private splitByDateline(n: ProjectionName, seg: RaDec[]): LonDec[][] {
    if (!seg.length) return [];

    const acc = seg.reduce<Acc>(
      (state, [ra, dec]) => {
        const lon = this.raToLonForProj(n, ra);
        const { prevLon, current, chunks } = state;

        // jeśli przeskoczyliśmy >180°, zamykamy aktualny chunk
        const crossedDateline = prevLon != null && Math.abs(lon - prevLon) > 180;

        const newChunks = crossedDateline && current.length ? [...chunks, current] : chunks;

        const newCurrent = crossedDateline ? [] : current;

        return {
          chunks: newChunks,
          current: [...newCurrent, [lon, dec]],
          prevLon: lon,
        };
      },
      { chunks: [], current: [], prevLon: null }
    );

    const allChunks = acc.current.length ? [...acc.chunks, acc.current] : acc.chunks;
    return allChunks;
  }

  private raToLonForProj(n: ProjectionName, ra: number): number {
    return this.isRectangular(n) ? ((((ra + 180) % 360) + 360) % 360) - 180 : ra;
  }

  private isRectangular(n: ProjectionName): boolean {
    return n === 'equirect' || n === 'mercator';
  }
}
