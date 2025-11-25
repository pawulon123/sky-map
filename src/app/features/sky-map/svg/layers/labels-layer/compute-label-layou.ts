import { isInRange } from '../../../../../core/utils/utils-function';
import { defaultStarsSettings } from '../../../domain/default/stars';
import { Star } from '../../../domain/models/star.model';
import { LabelBox, LabelPlacement, StarsLabelsSettings } from '../../../domain/models/stars-layer-settings.model';

export const computeLabelLayout = (
  settings: StarsLabelsSettings,
  labeledStars: Star[],
  getLabelLines: (star: Star, settings: StarsLabelsSettings) => string[]
): LabelPlacement[] => {
  if (!settings.visible) return [];
  const { fontSize: fS, magnitudeRange } = settings;

  const fontSize: number = fS ?? defaultStarsSettings.labels.fontSize;

  const cellSize = fontSize * 8;
  const grid = new Map<string, LabelBox[]>();
  const placements: LabelPlacement[] = [];

  const candidates = [...labeledStars].filter((s) => isInRange(s.mag, magnitudeRange)).sort((a, b) => a.mag - b.mag);

  const positionConfigs = [
    { key: 'right', dx: 1, dy: 0, align: 'left' },
    { key: 'left', dx: -1, dy: 0, align: 'left' },
    { key: 'top', dx: 0, dy: -1, align: 'center' },
    { key: 'bottom', dx: 0, dy: 1, align: 'center' },
  ] as const;

  const labelOffset = radiusFn({} as Star) + 2;
  const lineSpacing = 1.1;

  for (const s of candidates) {
    const lines = getLabelLines(s, settings);
    if (lines.length === 0) continue;

    const [sx, sy] = starPx(s);

    const maxLineChars = Math.max(...lines.map((l) => l.length));
    const textWidth = maxLineChars * fontSize * 0.6;
    const textHeight = fontSize * (lines.length * lineSpacing);

    let placed = false;

    for (const pos of positionConfigs) {
      const { key, dx, dy } = pos;

      const anchorX = sx + dx * labelOffset;
      const anchorY = sy + dy * labelOffset;

      let x: number;
      let y: number;

      if (key === 'right') {
        x = anchorX;
        y = sy - (radiusFn(s) + 2);
      } else if (key === 'left') {
        x = anchorX - textWidth;
        y = sy - (radiusFn(s) + 2);
      } else if (key === 'top') {
        x = anchorX - textWidth / 2;
        y = anchorY - textHeight / 2;
      } else {
        // 'bottom'
        x = anchorX - textWidth / 2;
        y = anchorY + textHeight;
      }

      const box: LabelBox = {
        x1: x,
        y1: y - textHeight,
        x2: x + textWidth,
        y2: y,
      };

      if (!collidesWithGrid(box, grid, cellSize)) {
        placements.push({ star: s, x, y, positionKey: key });
        insertBoxToGrid(box, grid, cellSize);
        placed = true;
        break;
      }
    }
  }
  return placements;
};

const radiusFn: (s: Star) => number = () => 2;
const starPx = (s: Star): [number, number] => {
  const p = s.__projected ?? [0, 0];
  return [p[0], p[1]];
};
const collidesWithGrid = (box: LabelBox, grid: Map<string, LabelBox[]>, cellSize: number): boolean => {
  const { minCx, maxCx, minCy, maxCy } = boxToCellRange(box, cellSize);

  for (let cx = minCx; cx <= maxCx; cx++) {
    for (let cy = minCy; cy <= maxCy; cy++) {
      const key = cellKey(cx, cy);
      const cellBoxes = grid.get(key);
      if (!cellBoxes) continue;

      for (const b of cellBoxes) {
        if (boxesOverlap(box, b)) {
          return true;
        }
      }
    }
  }
  return false;
};
const cellKey = (cx: number, cy: number): string => {
  return `${cx}:${cy}`;
};

const boxesOverlap = (a: LabelBox, b: LabelBox): boolean => {
  const separated = a.x2 < b.x1 || a.x1 > b.x2 || a.y2 < b.y1 || a.y1 > b.y2;
  return !separated;
};
const boxToCellRange = (box: LabelBox, cellSize: number) => {
  const minCx = Math.floor(box.x1 / cellSize);
  const maxCx = Math.floor(box.x2 / cellSize);
  const minCy = Math.floor(box.y1 / cellSize);
  const maxCy = Math.floor(box.y2 / cellSize);
  return { minCx, maxCx, minCy, maxCy };
};

const insertBoxToGrid = (box: LabelBox, grid: Map<string, LabelBox[]>, cellSize: number): void => {
  const { minCx, maxCx, minCy, maxCy } = boxToCellRange(box, cellSize);

  for (let cx = minCx; cx <= maxCx; cx++) {
    for (let cy = minCy; cy <= maxCy; cy++) {
      const key = cellKey(cx, cy);
      let arr = grid.get(key);
      if (!arr) {
        arr = [];
        grid.set(key, arr);
      }
      arr.push(box);
    }
  }
};
