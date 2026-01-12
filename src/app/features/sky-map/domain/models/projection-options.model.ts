import { ElementRef } from '@angular/core';

export type ProjectionName =
  | 'stereographic'
  | 'azimuthal' // azimuthal equidistant
  | 'azimuthalEA' // azimuthal equal-area
  | 'orthographic'
  | 'gnomonic'
  | 'mercator'
  | 'equirect';

export interface ProjectionSettings {
  height: number;
  width: number;
  projectionName: ProjectionName;
  mirrorX: boolean;
  selected: string[];
  mode: ModeProjection;
  panelSize: { w: number; h: number };
  gap: number;
  padding: number;
  columns: number;
}
export type ModeProjection = 'panels' | 'map';
