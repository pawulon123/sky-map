export interface BoundarySettings {
  visible: boolean;
  color: string;
}

export interface BoundaryPath {
  d: string;
  boundary: Boundary;
}
export interface Boundary {
  abbrev: string;
  name?: string;
  segments: [number, number][][]; // [[ [ra°,dec], ... ], ...]
  label?: { ra_deg: number; dec: number } | null;
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
