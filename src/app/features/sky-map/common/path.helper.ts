type XY = [number, number];

export function shortenedSegmentPaths(points: ReadonlyArray<XY>, gap: number): string[] {
  const g = Math.max(0, gap);
  if (points.length < 2) return [];
  if (g === 0) {
    return points.slice(0, -1).map(([x1, y1], i) => {
      const [x2, y2] = points[i + 1];
      return `M${x1},${y1} L${x2},${y2}`;
    });
  }

  return points
    .slice(0, -1)
    .map(([x1, y1], i) => {
      const [x2, y2] = points[i + 1];

      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy);
      if (len === 0) return null;

      const shrink = Math.min(g, len / 2);
      if (len <= 2 * shrink) return null;

      const ux = dx / len;
      const uy = dy / len;

      const sx1 = x1 + ux * shrink;
      const sy1 = y1 + uy * shrink;
      const sx2 = x2 - ux * shrink;
      const sy2 = y2 - uy * shrink;

      return `M${sx1},${sy1} L${sx2},${sy2}`;
    })
    .filter((p): p is string => p !== null);
}
