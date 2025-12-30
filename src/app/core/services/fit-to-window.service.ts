import { inject, Injectable } from '@angular/core';
import { EventCommonMenu } from '../common/event-common-menu';
import { SvgDataService } from './svg-data-ref.service';

@Injectable({
  providedIn: 'root',
})
export class FitToWindowService {
  svgRefService = inject(SvgDataService);
  ev({ fitToWindow }: EventCommonMenu) {
    if (fitToWindow === 'fit') this.fitToWindow();
  }
  fitToWindow() {
    const toolbarH = 0;
    const maxW = document.documentElement.clientWidth;
    const maxH = Math.max(0, document.documentElement.clientHeight - toolbarH);

    this.svgRefService.setWidth(String(maxW));
    this.svgRefService.setHeight(String(maxH));

    this.svgRefService.resizeViewBox();
  }
}
