import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { BoundariesService } from '../../../services/boundaries.service';
import { ProjectionService } from '../../../services/projection.service';

@Component({
  selector: 'g[app-boundaries-layer]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'boundaries-layer.component.html',
})
export class BoundariesLayerComponent implements OnInit {
  private svc  = inject(BoundariesService);
  private proj = inject(ProjectionService);

  ngOnInit() {
    this.svc.loadOnce();
  }

  // ★ nowa funkcja rozcinająca z interpolacją na meridianie RA
  private splitAtWrapWithInterpolation(segRaDec: [number, number][]): [number, number][][] {
    const out: [number, number][][] = [];
    let cur: [number, number][] = [];
    if (segRaDec.length === 0) return out;

    const norm360 = (ra: number) => ((ra % 360) + 360) % 360;

    let [prevRaRaw, prevDec] = segRaDec[0];
    let prevRa = norm360(prevRaRaw);
    cur.push([prevRa, prevDec]);

    for (let i = 1; i < segRaDec.length; i++) {
      const [rawRa, dec] = segRaDec[i];
      let ra = norm360(rawRa);

      const needsWrapBreak = Math.abs(rawRa - prevRaRaw) > 180;

      if (needsWrapBreak) {
        // określ, czy przeszliśmy 360→0 czy 0→360
        const wrapDown = prevRaRaw > rawRa; // 360 -> 0

        const raBoundaryA = wrapDown ? 360 : 0;
        const raBoundaryB = wrapDown ? 0   : 360;

        const totalSpan = (rawRa - prevRaRaw);
        const boundarySpan = (wrapDown ? raBoundaryA : raBoundaryA) - prevRaRaw;
        const t = totalSpan === 0 ? 0 : boundarySpan / totalSpan;
        const decInterp = prevDec + t * (dec - prevDec);

        const boundaryPointA: [number, number] = [norm360(raBoundaryA), decInterp];
        const boundaryPointB: [number, number] = [norm360(raBoundaryB), decInterp];

        // zamknij bieżący fragment
        cur.push(boundaryPointA);
        out.push(cur);

        // zacznij nowy fragment
        cur = [boundaryPointB, [ra, dec]];
      } else {
        cur.push([ra, dec]);
      }

      prevRaRaw = rawRa;
      prevDec   = dec;
      prevRa    = ra;
    }

    if (cur.length > 1) {
      out.push(cur);
    }

    return out;
  }

  private projectRaDecToScreen(raDeg: number, decDeg: number): [number, number] | null {
    const base = this.proj.projectRaDec(raDeg, decDeg);
    if (!base) return null;
    const w = this.proj.width();
    let [x, y] = base;
    x = w - x;
    return [x, y];
  }

  private segmentToPath(segRaDec: [number, number][]): string {
    const xy: [number, number][] = [];
    for (const [ra, dec] of segRaDec) {
      const p = this.projectRaDecToScreen(ra, dec);
      if (p) xy.push(p);
    }
    if (xy.length < 2) return '';
    let d = `M${xy[0][0]},${xy[0][1]}`;
    for (let i = 1; i < xy.length; i++) {
      d += `L${xy[i][0]},${xy[i][1]}`;
    }
    return d;
  }

  paths = computed(() => {
    const allBoundaries = this.svc.data().boundaries ?? [];
    const out: string[] = [];

    for (const boundary of allBoundaries) {
      const segs = boundary.segments ?? [];
      for (const segRaDec of segs) {
        // ★ używamy nowego splitowania
        const chunks = this.splitAtWrapWithInterpolation(segRaDec);

        for (const ch of chunks) {
          const d = this.segmentToPath(ch);
          if (d) out.push(d);
        }
      }
    }

    return out;
  });
}
