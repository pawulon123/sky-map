import { RaDecPoint, ScreenChunk, ScreenPoint } from '../../../domain/models/boundary.model';

export const segmentToScreenChunks = (
  segRaDec: RaDecPoint[],
  settings: () => { width: number }, // dopasowane do this.proj.settings()
  projectStarStyle: (ra: number, dec: number) => ScreenPoint | null
): ScreenChunk[] => {
  const w = settings().width;
  const maxJump = w * 0.5;

  const chunks: ScreenChunk[] = [];
  let current: ScreenChunk = [];
  let prevPt: ScreenPoint | null = null;

  for (const [ra, dec] of segRaDec) {
    const screenPt = projectStarStyle(ra, dec);
    if (!screenPt) {
      if (current.length) {
        chunks.push(current);
        current = [];
      }
      prevPt = null;
      continue;
    }

    const [x, y] = screenPt;

    if (prevPt) {
      const [px] = prevPt;
      const dx = Math.abs(x - px);
      if (dx > maxJump) {
        if (current.length) {
          chunks.push(current);
        }
        current = [];
      }
    }

    current.push([x, y]);
    prevPt = [x, y];
  }

  if (current.length) {
    chunks.push(current);
  }

  return chunks;
};
