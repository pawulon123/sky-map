import { Boundary } from '../../../domain/models/boundary.model';

export const getComputedBoundary = (boundary: Boundary, pathD: string) => {
  const PX_TO_MM = 0.2645833;
  const bbox = computePathBoundingBox(pathD);

  const widthMm = bbox.width * PX_TO_MM;
  const heightMm = bbox.height * PX_TO_MM;

  const name = boundary.name ?? boundary.abbrev ?? 'Nieznany gwiazdozbiór';

  return `${name}
szerokość = ${widthMm.toFixed(1)} mm
wysokość = ${heightMm.toFixed(1)} mm
(minX = ${bbox.minX.toFixed(1)} px, maxX = ${bbox.maxX.toFixed(1)} px)
(minY = ${bbox.minY.toFixed(1)} px, maxY = ${bbox.maxY.toFixed(1)} px)`;
};

const computePathBoundingBox = (
  d: string
): {
  width: number;
  height: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} => {
  const parts = d.match(/[ML]\s*([0-9\.\-]+),([0-9\.\-]+)/gi);
  if (!parts) {
    return { width: 0, height: 0, minX: 0, maxX: 0, minY: 0, maxY: 0 };
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const p of parts) {
    const match = p.match(/([0-9\.\-]+),([0-9\.\-]+)/);
    if (!match) continue;

    const x = parseFloat(match[1]);
    const y = parseFloat(match[2]);

    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  return {
    width: maxX - minX,
    height: maxY - minY,
    minX,
    maxX,
    minY,
    maxY,
  };
};
