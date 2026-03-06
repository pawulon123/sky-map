import { Star } from '../models/star.model';
import { FontSVG } from './font';

export interface PanelLabel extends FontSVG {
  visible: boolean;
  position: LabelPanelPosition;
}

export type LabelPanelPosition = 'rightTop' | 'leftTop' | 'rightBottom' | 'leftBottom' | 'centerTop' | 'centerBottom';

export type RaDec = [number, number];
export type XY = [number, number];

export interface PanelStarVM {
  x: number; // globalne (w dużym SVG): 0..totalW
  y: number; // globalne (w dużym SVG): 0..totalH
  r: number; // promień w jednostkach panelu (nie skaluje się z s)
}

export interface ConstellationPanelVM {
  id: string;
  constelationId: string;
  name?: string;
  abbrev: string;

  x: number;
  y: number;

  w: number;
  h: number;

  clipId: string;
  transform: string;
  paths: string[];

  stars: RenderPanelStar[];
}

export interface ConstellationPanelsLayoutVM {
  totalW: number;
  totalH: number;
  panels: ConstellationPanelVM[];
}

// geometry “pośrednia” (dla serwisów)
export interface BBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface ConstellationGeometryVM {
  raCenter: number;
  segsXY: XY[][];
  bbox: BBox | null;
  paths: string[];
}
// panels.model.ts (albo nowy plik)

export type PanelStarShape = 'circle' | 'ring' | 'star' | 'square' | 'triangle' | 'cross' | 'custom';

export interface PanelStarSymbolSettings {
  shape: PanelStarShape;

  // skala ogólna symbolu
  size?: number; // default 1

  // skalowanie po jasności (0..50 jak na mapie)
  scaleByMagnitude?: number; // default 0

  // filtry
  magMax?: number; // default np. 6.5

  // styl
  color?: string; // np. '#fff' albo CSS var
  strokeColor?: string;
  strokeWidth?: number; // mnożnik
  fillOpacity?: number;
  strokeOpacity?: number;
}

export interface RenderPanelStar {
  star: Star;

  x: number; // globalne w dużym SVG (jak wcześniej)
  y: number;

  mag: number | null;

  shape: PanelStarShape;

  // rozmiar finalny (jak r w mapie)
  r: number;

  // dodatki zależne od shape
  polygonPoints: string;
  customTransform: string;

  // „stroke widths” analogicznie do mapy (opcjonalne)
  baseStrokeWidth: number;
  ringStrokeWidth: number;
  crossStrokeWidth: number;

  // style
  fillColor: string;
  fillOpacity: number;
  strokeColor: string;
  strokeOpacity: number;
  hasFill: boolean;
  opacity: number;
}
