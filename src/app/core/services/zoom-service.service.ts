import { inject, Injectable } from '@angular/core';
import { SvgDataService } from './svg-data-ref.service';
import { EventCommonMenu, ZoomMode } from '../common/event-common-menu';

@Injectable({
  providedIn: 'root',
})
export class ZoomService {
  svgRefService = inject(SvgDataService);
  ev({ zoomMode }: EventCommonMenu) {
    this.svgRefService.detachClick();

    if (!this.svgRefService.svgNativeEl || zoomMode === 'none' || !zoomMode) {
      this.svgRefService.clickHandler = null;
      return;
    }

    this.svgRefService.clickHandler = (e: MouseEvent) => this.onSvgClick(e, zoomMode);
    this.svgRefService.addEventListener('click', this.svgRefService.clickHandler);
  }

  private onSvgClick(evt: MouseEvent, zoomMode: ZoomMode) {
    if (this.svgRefService.didPan) {
      this.svgRefService.didPan = false;
      return;
    }

    if (zoomMode === 'none') return;

    const maxZoomOut = 6;
    const zoomFactor = 1.25;

    const svg = this.svgRefService.svgNativeEl;
    if (!svg) return;

    const p = this.clientPointToSvg(svg, evt.clientX, evt.clientY);

    const contentW = this.svgRefService.svgData.width;
    const contentH = this.svgRefService.svgData.height;

    let w2 = this.svgRefService.viewBox.w;
    let h2 = this.svgRefService.viewBox.h;

    if (zoomMode === 'in') {
      w2 = this.svgRefService.viewBox.w / zoomFactor;
      h2 = this.svgRefService.viewBox.h / zoomFactor;
    } else if (zoomMode === 'out') {
      w2 = this.svgRefService.viewBox.w * zoomFactor;
      h2 = this.svgRefService.viewBox.h * zoomFactor;
    }

    const minSize = 10;
    const maxW = contentW * maxZoomOut;
    const maxH = contentH * maxZoomOut;

    w2 = Math.max(minSize, Math.min(w2, maxW));
    h2 = Math.max(minSize, Math.min(h2, maxH));

    const rx = (p.x - this.svgRefService.viewBox.x) / this.svgRefService.viewBox.w;
    const ry = (p.y - this.svgRefService.viewBox.y) / this.svgRefService.viewBox.h;

    let x2 = p.x - rx * w2;
    let y2 = p.y - ry * h2;

    const minX = Math.min(0, contentW - w2);
    const maxX = Math.max(0, contentW - w2);
    const minY = Math.min(0, contentH - h2);
    const maxY = Math.max(0, contentH - h2);

    x2 = Math.max(minX, Math.min(x2, maxX));
    y2 = Math.max(minY, Math.min(y2, maxY));

    this.svgRefService.viewBox = { x: x2, y: y2, w: w2, h: h2 };
    this.svgRefService.setViewBox(`${x2} ${y2} ${w2} ${h2}`);
  }

  private clientPointToSvg(svg: SVGSVGElement, clientX: number, clientY: number) {
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;

    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };

    return pt.matrixTransform(ctm.inverse());
  }
}
