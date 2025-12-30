import { Injectable } from '@angular/core';
import { SvgData, SvgRef } from '../common/svg-data';
import { svgDataDefault } from '../default/svg-data';

@Injectable({
  providedIn: 'root',
})
export class SvgDataService {
  svgData: SvgData = svgDataDefault;
  svgNativeEl: SVGSVGElement | null = null;

  viewBox = { x: 0, y: 0, w: 0, h: 0 };

  didPan = false;
  clickHandler: ((e: MouseEvent) => void) | null = null;

  setSvgRef(svgRef: SvgRef) {
    this.svgNativeEl = svgRef?.nativeElement ?? null;
  }

  setSvgData(svgData: SvgData) {
    this.svgData = svgData;
    this.resize();
  }

  addEventListener(ev: string, method: any) {
    if (!this.svgNativeEl) return;
    this.svgNativeEl.addEventListener(ev, method);
  }

  detachClick() {
    if (!this.svgNativeEl || !this.clickHandler) return;
    this.svgNativeEl.removeEventListener('click', this.clickHandler);
  }

  get getSvgNativeEl() {
    return this.svgNativeEl;
  }

  resize() {
    this.resizeViewBox();
    this.resizeWidthHeight(this.svgData);
  }

  // resize() {
  // // NIE resetuj viewBox jeśli już jest ustawiony (w/h > 0)
  // if (!this.viewBox.w || !this.viewBox.h) {
  //   this.resizeViewBox();
  // }
  // this.resizeWidthHeight(this.svgData);
  // }
  private resizeWidthHeight({ width: w, height: h }: SvgData) {
    this.setHeight(`${h}`);
    this.setWidth(`${w}`);
  }

  resizeViewBox({ width: w, height: h } = this.svgData) {
    this.setViewBox(`0 0 ${w} ${h}`);
    this.viewBox = { x: 0, y: 0, w, h };
  }

  setWidth(value: string) {
    this.setAttributeOnSvg('width', value);
  }

  setViewBox(value: string) {
    this.setAttributeOnSvg('viewBox', value);
  }

  setHeight(value: string) {
    this.setAttributeOnSvg('height', value);
  }

  private setAttributeOnSvg(attributeName: string, value: string) {
    if (!this.svgNativeEl) return;
    this.svgNativeEl.setAttribute(attributeName, value);
  }
}
