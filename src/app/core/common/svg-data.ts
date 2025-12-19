import { ElementRef } from '@angular/core';

export interface SvgData {
  width: number;
  height: number;
  svgRef?: ElementRef<SVGSVGElement> | null;
}
