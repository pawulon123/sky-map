import { RaDec } from './constellation-line.model';

export type Lines = {
  visible: boolean;
  color: string;
  hitWidth: number;
  lineWidth: number;
  hoverColor: string;
  dashSize: number;
  strokeOpacity: number;
  style: string;
  hoverScale: number;
  dasharray: string | null;
};
export type BoundaryLabels = {
  visible: boolean;
  language: BoundaryLanguage;
  fontSize: number;
  letterSpacing: number;
  fontFamily: string;
  fontWeight: string;
  stroke: string;
  strokeWidth: number;
  strokeOpacity: number;
};

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
// np. w tym samym folderze co segment-to-screen-chunks.ts
export type RaDecPoint = [ra: number, dec: number];
export type ScreenPoint = [x: number, y: number];
export type ScreenChunk = ScreenPoint[];
export type ChunkWithBoundary = {
  chunk: ScreenChunk;
  boundary: Boundary;
};
export type LabelBoundary = {
  x: number;
  y: number;
  abbrev: string;
  name: string;
};
export type PieceState = {
  pieces: RaDec[][];
  current: RaDec[];
};

export type Segments = Boundary['segments'];
