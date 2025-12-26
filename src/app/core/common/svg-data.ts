import { ElementRef } from '@angular/core';

export interface SvgData {
  width: number;
  height: number;
}
export type SvgRef = ElementRef<SVGSVGElement> | null;
