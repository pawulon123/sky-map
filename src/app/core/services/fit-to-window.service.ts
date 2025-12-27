import { inject, Injectable } from '@angular/core';
import { EventCommonMenu } from '../common/event-common-menu';
import { SvgDataService } from './svg-data-ref.service';

@Injectable({
  providedIn: 'root',
})
export class FitToWindowService {
  svgRefService = inject(SvgDataService);
  ev({ fitToWindow }: EventCommonMenu) {
    fitToWindow === 'fit' ? this.fitToWindow() : this.svgRefService.resize();
  }

  fitToWindow() {
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;

    const toolbarH = 0;
    const maxW = innerWidth;
    const maxH = Math.max(0, (innerHeight ?? 0) - toolbarH);

    const s = Math.min(maxW / this.svgRefService.svgData.width, maxH / this.svgRefService.svgData.height);

    this.svgRefService.setWidth(`${Math.floor(this.svgRefService.svgData.width * s)}`);
    this.svgRefService.setHeight(`${Math.floor(this.svgRefService.svgData.height * s)}`);
  }
}
