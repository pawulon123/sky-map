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
}
