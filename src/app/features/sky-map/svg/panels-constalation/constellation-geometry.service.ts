import { Injectable, computed, inject } from '@angular/core';
import {
  ConstellationLinesService,
  ConstellationLine,
} from '../../domain/services/constellation-lines/constellation-lines.service';
import { ConstellationGeometryVM, XY } from '../../domain/models/panels.model';
import { computeBBox, computeRaCenter, raAlign, segmentToPath, wrapDeltaRa } from './sky-panel-projection.util';

@Injectable({ providedIn: 'root' })
export class ConstellationGeometryService {
  private lines = inject(ConstellationLinesService);

  constructor() {
    void this.lines.loadOnce().catch((err) => console.error('ConstellationLines loadOnce failed', err));
  }

  readonly loaded = computed(() => this.lines.loaded());

  readonly sortedConstellations = computed<ConstellationLine[]>(() => {
    const items = this.lines.data().items ?? [];
    return [...items].sort((a, b) => (a.abbrev ?? '').localeCompare(b.abbrev ?? ''));
  });

  buildGeometry(c: ConstellationLine): ConstellationGeometryVM {
    const raCenter = computeRaCenter(c.segments ?? []);

    const segsXY: XY[][] = (c.segments ?? [])
      .map((seg) =>
        seg.map(([ra, dec]) => {
          // uwaga: w liniach nie było raAlign w Twoim kodzie – zachowuję Twoją logikę:
          // dx = wrapDeltaRa(ra, center), dy = -dec
          const dx = wrapDeltaRa(ra, raCenter);
          const dy = -dec;
          return [dx, dy] as XY;
        })
      )
      .filter((seg) => seg.length >= 2);

    const bbox = computeBBox(segsXY);
    const paths = segsXY.map(segmentToPath);

    return { raCenter, segsXY, bbox, paths };
  }

  /** Export helper dla gwiazd (żeby były spójne z lonToRa) */
  raAlign = raAlign;
}
