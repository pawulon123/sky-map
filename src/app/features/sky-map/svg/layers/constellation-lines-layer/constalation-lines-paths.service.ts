import { computed, inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProjectionName } from '../../../domain/models/projection-options.model';
import { ConstellationLinesService } from '../../../domain/services/constellation-lines/constellation-lines.service';
import { ProjectionService } from '../../../domain/services/projection/projection.service';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { ConstellationLineSettings } from '../../../domain/models/constellation-line.model';
import { constellationLineDefaultSettings } from '../../../domain/default/constellation-line';
import { SelectedIdService } from '../../../domain/services/sky-map-state/allowed-ids-policy.service';
import { shortenedSegmentPaths } from '../../../common/path.helper';

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
  private selectedId = inject(SelectedIdService);
  constructor() {
    this.svc.loadOnce();
  }

  private readonly lineSettings = toSignal(this.state.constellationLineSettings$, {
    initialValue: {
      nodeGap: constellationLineDefaultSettings.nodeGap,
    } as ConstellationLineSettings,
  });

  readonly data = computed(() => {
    const { projectionName } = this.proj.settings();
    const settings = this.lineSettings();
    const nodeGap = settings.nodeGap ?? 0;
    const gap = Math.max(0, nodeGap);

    const items = this.svc.data().items ?? [];

    const filteredItems = this.selectedId.filter(items);

    return filteredItems
      .flatMap((c) => c.segments ?? [])
      .flatMap((seg) => this.splitByDateline(projectionName, seg))
      .flatMap((chunk) => this.makeShortenedSegmentPaths(chunk, gap));
  });

  private makeShortenedSegmentPaths(pts: LonDec[], gap: number): string[] {
    if (pts.length < 2) return [];

    const xy: XY[] = pts.map(([lon, dec]) => this.proj.getProjectionByLonLat(lon, dec) as XY);

    return shortenedSegmentPaths(xy, gap);
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
