import { Injectable } from '@angular/core';
import { SvgData, SvgRef } from '../common/svg-data';
import { svgDataDefault } from '../default/svg-data';
import { ZoomMode } from '../common/event-common-menu';

@Injectable({
  providedIn: 'root',
})
export class SvgDataService {
  private svgData: SvgData = svgDataDefault;
  private svgNativeEl: SVGSVGElement | null = null;

  private viewBox = { x: 0, y: 0, w: 0, h: 0 };

  private clickHandler: ((e: MouseEvent) => void) | null = null;

  setSvgRef(svgRef: SvgRef) {
    this.svgNativeEl = svgRef?.nativeElement ?? null;
  }

  setSvgData(svgData: SvgData) {
    this.svgData = svgData;
    this.resize();
  }
  toggleZoom(mode: ZoomMode) {
    this.detachClick();

    if (!this.svgNativeEl || mode === 'none') {
      this.clickHandler = null;
      return;
    }

    this.clickHandler = (e: MouseEvent) => this.onSvgClick(e, mode);
    this.svgNativeEl.addEventListener('click', this.clickHandler);
  }

  private detachClick() {
    if (!this.svgNativeEl || !this.clickHandler) return;
    this.svgNativeEl.removeEventListener('click', this.clickHandler);
  }

  getSvgNativeEl() {
    return this.svgNativeEl;
  }

  private onSvgClick(evt: MouseEvent, zoomMode: ZoomMode) {
    if (zoomMode === 'none') return;

    const maxZoomOut = 6;
    const zoomFactor = 1.25;

    const svg = this.svgNativeEl;
    if (!svg) return;

    const p = this.clientPointToSvg(svg, evt.clientX, evt.clientY);

    const contentW = this.svgData.width;
    const contentH = this.svgData.height;

    let w2 = this.viewBox.w;
    let h2 = this.viewBox.h;

    if (zoomMode === 'in') {
      w2 = this.viewBox.w / zoomFactor;
      h2 = this.viewBox.h / zoomFactor;
    } else if (zoomMode === 'out') {
      w2 = this.viewBox.w * zoomFactor;
      h2 = this.viewBox.h * zoomFactor;
    }

    const minSize = 10;
    const maxW = contentW * maxZoomOut;
    const maxH = contentH * maxZoomOut;

    w2 = Math.max(minSize, Math.min(w2, maxW));
    h2 = Math.max(minSize, Math.min(h2, maxH));

    const rx = (p.x - this.viewBox.x) / this.viewBox.w;
    const ry = (p.y - this.viewBox.y) / this.viewBox.h;

    let x2 = p.x - rx * w2;
    let y2 = p.y - ry * h2;

    const minX = Math.min(0, contentW - w2);
    const maxX = Math.max(0, contentW - w2);
    const minY = Math.min(0, contentH - h2);
    const maxY = Math.max(0, contentH - h2);

    x2 = Math.max(minX, Math.min(x2, maxX));
    y2 = Math.max(minY, Math.min(y2, maxY));

    this.viewBox = { x: x2, y: y2, w: w2, h: h2 };
    this.setViewBox(`${x2} ${y2} ${w2} ${h2}`);
  }

  private clientPointToSvg(svg: SVGSVGElement, clientX: number, clientY: number) {
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;

    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };

    return pt.matrixTransform(ctm.inverse());
  }

  resetToRealSize() {
    this.resize();
  }

  fitToWindow() {
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;

    const toolbarH = 0;
    const maxW = innerWidth;
    const maxH = Math.max(0, (innerHeight ?? 0) - toolbarH);

    const s = Math.min(maxW / this.svgData.width, maxH / this.svgData.height);

    this.setWidth(`${Math.floor(this.svgData.width * s)}`);
    this.setHeight(`${Math.floor(this.svgData.height * s)}`);
  }

  resize() {
    this.resizeViewBox(this.svgData);
    this.resizeWidthHeight(this.svgData);
  }

  private resizeWidthHeight({ width: w, height: h }: SvgData) {
    this.setHeight(`${h}`);
    this.setWidth(`${w}`);
  }

  private resizeViewBox({ width: w, height: h }: SvgData) {
    this.setViewBox(`0 0 ${w} ${h}`);
    this.viewBox = { x: 0, y: 0, w, h };
  }

  private setWidth(value: string) {
    this.setAttributeOnSvg('width', value);
  }

  private setViewBox(value: string) {
    this.setAttributeOnSvg('viewBox', value);
  }

  private setHeight(value: string) {
    this.setAttributeOnSvg('height', value);
  }

  private setAttributeOnSvg(attributeName: string, value: string) {
    if (!this.svgNativeEl) return;
    this.svgNativeEl.setAttribute(attributeName, value);
  }
}
