import { RaDec } from './constellation-line.model';
import { FontSVG } from './font';
import { LineSVGControll } from './line-svg-controll';
import { PolilineText } from './svg-general';

export interface Lines extends LineSVGControll {
  visible: boolean;
  hitWidth: number;
  hoverScale: number;
  hoverColor: string;
  dasharray: string | null;
}
export interface BoundaryLabels extends FontSVG {
  visible: boolean;
  language: BoundaryLanguage;
}

export interface BoundaryLayerSettings {
  lines: Lines;
  labels: BoundaryLabels;
}
export type BoundaryKey = 'lines' | 'labels';
export type BoundaryLanguage = 'latin' | 'polish';
export interface BoundaryPath {
  d: string;
  boundary: Boundary;
}
export interface Boundary {
  abbrev: string;
  name?: string;
  segments: [number, number][][]; // [[ [ra°,dec], ... ], ...]
  label?: { ra_deg: number; dec: number } | null;
  constelationId: string;
}
export interface BoundariesData {
  meta?: any;
  boundaries: Boundary[];
}

export type RaDecPoint = [ra: number, dec: number];
export type ScreenPoint = [x: number, y: number];
export type ScreenChunk = ScreenPoint[];
export type ChunkWithBoundary = {
  chunk: ScreenChunk;
  boundary: Boundary;
};
export interface LabelBoundary extends PolilineText {
  abbrev: string;
  name: string;
}
export type PieceState = {
  pieces: RaDec[][];
  current: RaDec[];
};

export type Segments = Boundary['segments'];
