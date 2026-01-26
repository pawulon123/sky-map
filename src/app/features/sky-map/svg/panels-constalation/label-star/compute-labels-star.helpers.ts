import { Star } from "../../../domain/models/star.model";
import { PanelLabelPlacement, PanelLabelBox, PanelLeaderLine } from "./label-star.model";


export interface PanelLabelSettings {
  visible: boolean;
  colision?: boolean;

  // filtr kandydatów
  magnitudeRange?: [number, number];

  // typografia
  fontSize?: number;
  letterSpacing?: number;
  lineHeight?: number;

  // geometria
  offsetPx?: number;
  paddingPx?: number;

  // leader lines
  leaderLines?: boolean;
}

export interface PanelStarPoint {
  panelId: string;
  star: Star;
  x: number; // global SVG
  y: number; // global SVG
  r?: number;
}

export interface PanelLabelLayoutEngineParams {
  settings: PanelLabelSettings;
  points: PanelStarPoint[];
  getLabelLines: (star: Star) => string[];
  collisionsEnabled?: boolean;
}

export function computePanelLabelLayoutEngine(params: PanelLabelLayoutEngineParams): PanelLabelPlacement[] {
  const { settings, points, getLabelLines } = params;
  const collisionsEnabled = params.collisionsEnabled ?? !!settings.colision;

  if (!settings.visible) return [];

  const fontSize = settings.fontSize ?? 10;
  const letterSpacing = settings.letterSpacing ?? 0;
  const lineHeight = settings.lineHeight ?? Math.round(fontSize * 1.15);
  const offsetPx = settings.offsetPx ?? 4;
  const paddingPx = settings.paddingPx ?? 2;

  // komórki siatki kolizji: kompromis szybkość/dokładność
  const cellSize = Math.max(24, fontSize * 8);

  // grid osobny per panel (kolizje tylko wewnątrz panelu)
  const grids = collisionsEnabled ? new Map<string, Map<string, PanelLabelBox[]>>() : null;

  const candidates = filterAndSortCandidates(points, settings);

  const placements: PanelLabelPlacement[] = [];

  for (const p of candidates) {
    const lines = getLabelLines(p.star);
    if (!lines.length) continue;

    const placement = tryPlaceLabelForPoint({
      p,
      lines,
      fontSize,
      letterSpacing,
      lineHeight,
      offsetPx,
      paddingPx,
      cellSize,
      collisionsEnabled,
      grids,
      leaderLines: !!settings.leaderLines,
    });

    if (placement) placements.push(placement);
  }

  return placements;
}

function filterAndSortCandidates(points: PanelStarPoint[], settings: PanelLabelSettings): PanelStarPoint[] {
  const range = settings.magnitudeRange;
  const filtered = !range
    ? points
    : points.filter((p) => {
        const m = p.star.mag;
        return typeof m === 'number' && m >= range[0] && m <= range[1];
      });

  // najpierw jaśniejsze (mniejsza mag), potem stabilnie po nazwie/ra
  return [...filtered].sort((a, b) => {
    const ma = a.star.mag ?? 99;
    const mb = b.star.mag ?? 99;
    if (ma !== mb) return ma - mb;
    return (a.star.name ?? '').localeCompare(b.star.name ?? '');
  });
}

function tryPlaceLabelForPoint(args: {
  p: PanelStarPoint;
  lines: string[];
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  offsetPx: number;
  paddingPx: number;
  cellSize: number;
  collisionsEnabled: boolean;
  grids: Map<string, Map<string, PanelLabelBox[]>> | null;
  leaderLines: boolean;
}): PanelLabelPlacement | null {
  const { p, lines, fontSize, letterSpacing, lineHeight, offsetPx, paddingPx, cellSize } = args;

  const textW = estimateTextWidth(lines, fontSize, letterSpacing) + paddingPx * 2;
  const textH = lines.length * lineHeight + paddingPx * 2;

  const candidates = buildCandidatePositions(p.x, p.y, (p.r ?? 0) + offsetPx, textW, textH);

  // grid per panel
  const grid = args.collisionsEnabled ? ensurePanelGrid(args.grids!, p.panelId) : null;

  for (const c of candidates) {
    const box: PanelLabelBox = { x: c.x, y: c.y, w: textW, h: textH };

    if (args.collisionsEnabled && grid) {
      if (collidesInGrid(grid, box, cellSize)) continue;
      insertIntoGrid(grid, box, cellSize);
    }

    const leader = args.leaderLines ? buildLeaderLine(p.x, p.y, box) : undefined;
    const leaderPointsAttr = leader ? leader.points.map(([x,y]) => `${x},${y}`).join(' ') : undefined;
    return {
      panelId: p.panelId,
      star: p.star,
      x: box.x,
      y: box.y,
      box,
      lines,
      leader,
      leaderPointsAttr,
    };
  }

  return null;
}

function buildCandidatePositions(x: number, y: number, d: number, w: number, h: number) {
  // preferencje: NE, NW, SE, SW + warianty „bliżej osi”
  return [
    { x: x + d, y: y - h / 2 },         // E
    { x: x - d - w, y: y - h / 2 },     // W
    { x: x - w / 2, y: y - d - h },     // N
    { x: x - w / 2, y: y + d },         // S
    { x: x + d, y: y - d - h },         // NE
    { x: x - d - w, y: y - d - h },     // NW
    { x: x + d, y: y + d },             // SE
    { x: x - d - w, y: y + d },         // SW
  ];
}

function estimateTextWidth(lines: string[], fontSize: number, letterSpacing: number) {
  // przybliżenie (dla kolizji wystarczy)
  const maxLen = Math.max(...lines.map((l) => (l ?? '').length), 0);
  const avgGlyph = fontSize * 0.6;
  return maxLen * (avgGlyph + letterSpacing);
}

function buildLeaderLine(starX: number, starY: number, box: PanelLabelBox): PanelLeaderLine {
  // najbliższy punkt ramki do gwiazdy -> prosta łamana 2 pkt
  const cx = clamp(starX, box.x, box.x + box.w);
  const cy = clamp(starY, box.y, box.y + box.h);
  return { points: [[starX, starY], [cx, cy]] };
}

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

/** Grid */

function ensurePanelGrid(grids: Map<string, Map<string, PanelLabelBox[]>>, panelId: string) {
  let g = grids.get(panelId);
  if (!g) {
    g = new Map<string, PanelLabelBox[]>();
    grids.set(panelId, g);
  }
  return g;
}

function gridKey(ix: number, iy: number) {
  return `${ix},${iy}`;
}

function boxToCells(box: PanelLabelBox, cellSize: number) {
  const x0 = Math.floor(box.x / cellSize);
  const y0 = Math.floor(box.y / cellSize);
  const x1 = Math.floor((box.x + box.w) / cellSize);
  const y1 = Math.floor((box.y + box.h) / cellSize);
  return { x0, y0, x1, y1 };
}

function collides(a: PanelLabelBox, b: PanelLabelBox) {
  return !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);
}

function collidesInGrid(grid: Map<string, PanelLabelBox[]>, box: PanelLabelBox, cellSize: number) {
  const { x0, y0, x1, y1 } = boxToCells(box, cellSize);
  for (let ix = x0; ix <= x1; ix++) {
    for (let iy = y0; iy <= y1; iy++) {
      const bucket = grid.get(gridKey(ix, iy));
      if (!bucket) continue;
      for (const other of bucket) {
        if (collides(other, box)) return true;
      }
    }
  }
  return false;
}

function insertIntoGrid(grid: Map<string, PanelLabelBox[]>, box: PanelLabelBox, cellSize: number) {
  const { x0, y0, x1, y1 } = boxToCells(box, cellSize);
  for (let ix = x0; ix <= x1; ix++) {
    for (let iy = y0; iy <= y1; iy++) {
      const k = gridKey(ix, iy);
      const bucket = grid.get(k);
      if (bucket) bucket.push(box);
      else grid.set(k, [box]);
    }
  }
}
export function invertPanelTransform(transform: string): { apply: (x: number, y: number) => [number, number] } {
  const parsed = parsePanelTransform(transform);

  // fallback bezpieczny: identity
  if (!parsed) return { apply: (x, y) => [x, y] };

  const { t1x, t1y, s, t2x, t2y } = parsed;
  const invS = s !== 0 ? 1 / s : 1;

  return {
    apply: (xG: number, yG: number) => {
      const x1 = (xG - t1x) * invS;
      const y1 = (yG - t1y) * invS;
      const xM = x1 - t2x;
      const yM = y1 - t2y;
      return [xM, yM];
    },
  };
}

/**
 * Parsuje string w formie:
 * "translate(a,b) scale(s) translate(c,d)"
 */
function parsePanelTransform(transform: string):
  | { t1x: number; t1y: number; s: number; t2x: number; t2y: number }
  | null {
  // bardzo “celowany” regex pod Twój format
  const re =
    /translate\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)\s*scale\(\s*([-\d.]+)\s*\)\s*translate\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/;

  const m = transform.match(re);
  if (!m) return null;

  const t1x = Number(m[1]);
  const t1y = Number(m[2]);
  const s = Number(m[3]);
  const t2x = Number(m[4]);
  const t2y = Number(m[5]);

  if (![t1x, t1y, s, t2x, t2y].every(Number.isFinite)) return null;

  return { t1x, t1y, s, t2x, t2y };
}