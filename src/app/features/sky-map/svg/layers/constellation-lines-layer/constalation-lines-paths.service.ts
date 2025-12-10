import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProjectionName } from '../../../domain/models/projection-options.model';
import { ConstellationLinesService } from '../../../domain/services/constellation-lines/constellation-lines.service';
import { ProjectionService } from '../../../domain/services/projection/projection.service';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { ConstellationLineSettings } from '../../../domain/models/constellation-line.model';
import { constellationLineDefaultSettings } from '../../../domain/default/constellation-line';

type RaDec = [number, number];
type LonDec = [number, number];
type XY = [number, number];

@Injectable({
  providedIn: 'root',
})
export class ConstalationLinesPathsService {
  private svc = inject(ConstellationLinesService);
  private proj = inject(ProjectionService);
  private state = inject(SkyMapStateService);

  constructor() {
    this.svc.loadOnce();
  }

  // Sygnał z ustawieniami linii konstelacji (oparty na BehaviorSubject → Observable)
  private readonly lineSettings = toSignal(this.state.constellationLineSettings$, {
    initialValue: {
      nodeGap: constellationLineDefaultSettings.nodeGap,
    } as ConstellationLineSettings,
  });

  // Główna lista ścieżek. ZALEŻY od lineSettings(), więc reaguje m.in. na nodeGap.
  readonly paths = computed(() => {
    const projectionName = this.proj.settings().projectionName as ProjectionName;

    const settings = this.lineSettings();
    const nodeGap = settings.nodeGap ?? 0;
    const gap = Math.max(0, nodeGap); // bez wartości ujemnych

    const items = this.svc.data().items ?? [];

    return items
      .flatMap((c) => c.segments ?? []) // wszystkie segmenty RA/Dec
      .flatMap((seg) => this.splitByDateline(projectionName, seg)) // pocięte na kawałki przy dateline
      .flatMap((chunk) => this.makeShortenedSegmentPaths(chunk, gap)); // każdy kawałek pocięty przy węzłach
  });

  /**
   * Z ciągu punktów [lon,dec] tworzy listę "uciętych" odcinków:
   * linia nie dochodzi do węzłów (gwiazd), odstęp = gap.
   */
  private makeShortenedSegmentPaths(pts: LonDec[], gap: number): string[] {
    if (pts.length < 2) return [];

    const xy: XY[] = pts.map(([lon, dec]) => this.proj.getProjectionByLonLat(lon, dec) as XY);

    const result: string[] = [];

    for (let i = 0; i < xy.length - 1; i++) {
      const [x1, y1] = xy[i];
      const [x2, y2] = xy[i + 1];

      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy);

      if (len === 0) continue;

      const shrink = Math.min(gap, len / 2);

      if (len <= 2 * shrink) continue;

      const ux = dx / len;
      const uy = dy / len;

      const sx1 = x1 + ux * shrink;
      const sy1 = y1 + uy * shrink;
      const sx2 = x2 - ux * shrink;
      const sy2 = y2 - uy * shrink;

      result.push(`M${sx1},${sy1} L${sx2},${sy2}`);
    }

    return result;
  }

  private splitByDateline(n: ProjectionName, seg: RaDec[]): LonDec[][] {
    if (!seg.length) return [];

    type Acc = {
      chunks: LonDec[][];
      current: LonDec[];
      prevLon: number | null;
    };

    const acc = seg.reduce<Acc>(
      (state, [ra, dec]) => {
        const lon = this.raToLonForProj(n, ra);
        const { prevLon, current, chunks } = state;

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
