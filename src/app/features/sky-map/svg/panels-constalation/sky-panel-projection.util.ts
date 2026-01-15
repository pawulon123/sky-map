// sky-panel-projection.util.ts
import { shortenedSegmentPaths } from '../../common/path.helper';
import { RaDec } from '../../domain/models/constellation-line.model';
import { XY } from '../../domain/models/panels.model';

export function computeRaCenter(segments: RaDec[][]): number {
  const pts: RaDec[] = segments.flat();
  if (!pts.length) return 0;

  let sx = 0;
  let sy = 0;

  for (const [ra] of pts) {
    const a = (ra * Math.PI) / 180;
    sx += Math.cos(a);
    sy += Math.sin(a);
  }

  const ang = Math.atan2(sy, sx);
  const deg = (ang * 180) / Math.PI;
  return (deg + 360) % 360;
}

export function wrapDeltaRa(ra: number, center: number): number {
  return ((((ra - center) % 360) + 540) % 360) - 180;
}

/** Musi być identyczne z lonToRa w ConstellationLinesService */
export function raAlign(raDeg: number): number {
  return ((-raDeg % 360) + 360) % 360;
}

export function computeBBox(segs: XY[][]): { minX: number; minY: number; maxX: number; maxY: number } | null {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  let any = false;

  for (const seg of segs) {
    for (const [x, y] of seg) {
      any = true;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  return any ? { minX, minY, maxX, maxY } : null;
}

export function segmentToPath(seg: XY[]): string {
  const [p0, ...rest] = seg;
  const head = `M${p0[0]},${p0[1]}`;
  const tail = rest.map((p) => `L${p[0]},${p[1]}`).join(' ');
  return tail ? `${head} ${tail}` : head;
}

export function makeShortenedSegmentPathsXY(segs: XY[][], gap: number): string[] {
  const g = Math.max(0, gap);
  if (g <= 0) {
    return segs.filter((s) => s.length >= 2).map(segmentToPath);
  }
  return segs.flatMap((seg) => shortenedSegmentPaths(seg, gap));
}
