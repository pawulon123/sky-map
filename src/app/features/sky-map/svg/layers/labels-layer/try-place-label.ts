import { LINE_SPACING, POSITION_CONFIGS } from '../../../domain/default/stars';
import { Star } from '../../../domain/models/star.model';
import {
  StarsLabelsSettings,
  LabelBox,
  LabelPlacement,
  PositionKey,
  PositionConfig,
} from '../../../domain/models/stars-layer-settings.model';

interface TryPlaceLabelForStarParams {
  star: Star;
  settings: StarsLabelsSettings;
  fontSize: number;
  letterSpacing: number;
  cellSize: number;
  grid: Map<string, LabelBox[]> | null;
  getLabelLines: (star: Star) => string[];
  collisionsEnabled: boolean;
}

export function tryPlaceLabelForStar(params: TryPlaceLabelForStarParams): LabelPlacement | null {
  const { star, fontSize, letterSpacing, cellSize, grid, getLabelLines, collisionsEnabled } = params;

  const lines = getLabelLines(star);
  if (lines.length === 0) return null;

  const [sx, sy] = starPx(star);
  const { textWidth, textHeight } = computeLabelDimensions(lines, fontSize, letterSpacing);
  const labelOffset = computeLabelOffset(star);

  for (const position of POSITION_CONFIGS) {
    const { anchorX, anchorY } = computeAnchorPoint(sx, sy, labelOffset, position);
    const { x, y } = computeLabelPositionForConfig(position.key, anchorX, anchorY, sx, sy, textWidth, textHeight, star);

    const box = createLabelBox(x, y, textWidth, textHeight);

    // --- kolizje wyłączone: bierzemy pierwszą pasującą pozycję bez sprawdzania gridu
    if (!collisionsEnabled) {
      return { star, x, y, positionKey: position.key };
    }

    // --- kolizje włączone
    if (grid && !collidesWithGrid(box, grid, cellSize)) {
      insertBoxToGrid(box, grid, cellSize);
      return { star, x, y, positionKey: position.key };
    }
  }

  return null;
}
const starPx = (s: Star): [number, number] => {
  const p = s.__projected ?? [0, 0];
  return [p[0], p[1]];
};

const computeLabelDimensions = (
  lines: string[],
  fontSize: number,
  letterSpacing: number
): { textWidth: number; textHeight: number } => {
  const maxLineChars = getMaxLineLength(lines);
  const baseCharWidth = estimateCharWidth(fontSize);

  const textWidth = maxLineChars > 0 ? maxLineChars * baseCharWidth + (maxLineChars - 1) * letterSpacing : 0;

  const textHeight = fontSize * (lines.length * LINE_SPACING);

  return { textWidth, textHeight };
};
const getMaxLineLength = (lines: string[]): number => Math.max(...lines.map((line) => line.length));
const estimateCharWidth = (fontSize: number): number => fontSize * 0.6;
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
const boxToCellRange = (box: LabelBox, cellSize: number) => {
  const minCx = Math.floor(box.x1 / cellSize);
  const maxCx = Math.floor(box.x2 / cellSize);
  const minCy = Math.floor(box.y1 / cellSize);
  const maxCy = Math.floor(box.y2 / cellSize);
  return { minCx, maxCx, minCy, maxCy };
};

const cellKey = (cx: number, cy: number): string => `${cx}:${cy}`;
const collidesWithGrid = (box: LabelBox, grid: Map<string, LabelBox[]>, cellSize: number): boolean => {
  const { minCx, maxCx, minCy, maxCy } = boxToCellRange(box, cellSize);

  for (let cx = minCx; cx <= maxCx; cx++) {
    for (let cy = minCy; cy <= maxCy; cy++) {
      const key = cellKey(cx, cy);
      const cellBoxes = grid.get(key);
      if (!cellBoxes) continue;

      for (const existingBox of cellBoxes) {
        if (boxesOverlap(box, existingBox)) {
          return true;
        }
      }
    }
  }
  return false;
};
const boxesOverlap = (a: LabelBox, b: LabelBox): boolean => {
  const separated = a.x2 < b.x1 || a.x1 > b.x2 || a.y2 < b.y1 || a.y1 > b.y2;
  return !separated;
};
const createLabelBox = (x: number, y: number, textWidth: number, textHeight: number): LabelBox => ({
  x1: x,
  y1: y - textHeight,
  x2: x + textWidth,
  y2: y,
});
const computeLabelPositionForConfig = (
  key: PositionKey,
  anchorX: number,
  anchorY: number,
  sx: number,
  sy: number,
  textWidth: number,
  textHeight: number,
  star: Star
): { x: number; y: number } => {
  if (key === 'right') {
    return {
      x: anchorX,
      y: sy - (radiusFn(star) + 2),
    };
  }

  if (key === 'left') {
    return {
      x: anchorX - textWidth,
      y: sy - (radiusFn(star) + 2),
    };
  }

  if (key === 'top') {
    return {
      x: anchorX - textWidth / 2,
      y: anchorY - textHeight / 2,
    };
  }

  // 'bottom'
  return {
    x: anchorX - textWidth / 2,
    y: anchorY + textHeight,
  };
};
const radiusFn: (s: Star) => number = () => 2;
const computeLabelOffset = (star: Star): number => radiusFn(star) + 2;
const computeAnchorPoint = (
  sx: number,
  sy: number,
  labelOffset: number,
  position: PositionConfig
): { anchorX: number; anchorY: number } => {
  const anchorX = sx + position.dx * labelOffset;
  const anchorY = sy + position.dy * labelOffset;
  return { anchorX, anchorY };
};
