import { Injectable, inject } from '@angular/core';
import { SvgDataService } from './svg-data-ref.service';
import { EventCommonMenu } from '../common/event-common-menu';

@Injectable({ providedIn: 'root' })
export class PanService {
  ev(EV: EventCommonMenu) {
    this.bind();
  }
  private svgRefService = inject(SvgDataService);

  private isPanning = false;
  private startClient = { x: 0, y: 0 };
  private startViewBox = { x: 0, y: 0, w: 0, h: 0 };
  private panned = false;

  // trzymamy referencje do handlerów, żeby dało się je odpiąć
  private onPointerDown = (evt: PointerEvent) => {
    const svg = this.svgRefService.svgNativeEl;
    if (!svg) return;

    // tylko lewy przycisk myszy; touch/pen przejdą
    if (evt.pointerType === 'mouse' && evt.button !== 0) return;
    this.syncViewBoxFromSvg(svg);
    // console.log('VB service', this.svgRefService.viewBox, 'VB attr', svg.getAttribute('viewBox'));

    this.isPanning = true;
    this.panned = false;

    this.startClient = { x: evt.clientX, y: evt.clientY };
    this.startViewBox = { ...this.svgRefService.viewBox };

    svg.setPointerCapture(evt.pointerId);
    evt.preventDefault();
  };

  private onPointerMove = (evt: PointerEvent) => {
    if (!this.isPanning) return;

    const svg = this.svgRefService.svgNativeEl;
    if (!svg) return;

    const p0 = this.clientPointToSvg(svg, this.startClient.x, this.startClient.y);
    const p1 = this.clientPointToSvg(svg, evt.clientX, evt.clientY);

    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;

    // próg, żeby drobne drgania nie były traktowane jako drag
    if (!this.panned) {
      const movedPx = Math.abs(evt.clientX - this.startClient.x) + Math.abs(evt.clientY - this.startClient.y);
      if (movedPx >= 3) this.panned = true;
    }

    // "chwytasz mapę i przesuwasz": obraz w prawo => kamera w lewo, więc -dx
    let x2 = this.startViewBox.x - dx;
    let y2 = this.startViewBox.y - dy;

    const { w, h } = this.startViewBox;
    const clamped = this.clampViewBox(x2, y2, w, h);

    this.svgRefService.viewBox = { x: clamped.x, y: clamped.y, w, h };
    this.svgRefService.setViewBox(`${clamped.x} ${clamped.y} ${w} ${h}`);

    evt.preventDefault();
  };

  private onPointerUp = (evt: PointerEvent) => {
    if (!this.isPanning) return;
    this.isPanning = false;

    const svg = this.svgRefService.svgNativeEl;
    if (svg && svg.hasPointerCapture(evt.pointerId)) {
      svg.releasePointerCapture(evt.pointerId);
    }

    // jeśli był drag – ustaw flagę, żeby klik-zoom nie odpalił po puszczeniu
    if (this.panned) {
      this.svgRefService.didPan = true;
    }
  };

  bind() {
    const svg = this.svgRefService.svgNativeEl;
    if (!svg) return;

    // UX na touch – bez tego telefon będzie próbował przewijać/zoomować stronę
    svg.style.touchAction = 'none';
    svg.style.cursor = 'grab';

    svg.addEventListener('pointerdown', this.onPointerDown);
    svg.addEventListener('pointermove', this.onPointerMove);
    svg.addEventListener('pointerup', this.onPointerUp);
    svg.addEventListener('pointercancel', this.onPointerUp);
  }

  unbind() {
    const svg = this.svgRefService.svgNativeEl;
    if (!svg) return;

    svg.removeEventListener('pointerdown', this.onPointerDown);
    svg.removeEventListener('pointermove', this.onPointerMove);
    svg.removeEventListener('pointerup', this.onPointerUp);
    svg.removeEventListener('pointercancel', this.onPointerUp);
  }

  private clampViewBox(x: number, y: number, w: number, h: number) {
    const contentW = this.svgRefService.svgData.width;
    const contentH = this.svgRefService.svgData.height;

    const minX = Math.min(0, contentW - w);
    const maxX = Math.max(0, contentW - w);
    const minY = Math.min(0, contentH - h);
    const maxY = Math.max(0, contentH - h);

    return {
      x: Math.max(minX, Math.min(x, maxX)),
      y: Math.max(minY, Math.min(y, maxY)),
    };
  }

  private clientPointToSvg(svg: SVGSVGElement, clientX: number, clientY: number) {
    const ctm = svg.getScreenCTM();

    // Standardowa ścieżka
    if (ctm) {
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      return pt.matrixTransform(ctm.inverse());
    }

    // Fallback: mapowanie przez boundingClientRect + aktualny viewBox
    const rect = svg.getBoundingClientRect();
    const vb = this.svgRefService.viewBox;

    if (!rect.width || !rect.height || !vb.w || !vb.h) return { x: 0, y: 0 };

    const nx = (clientX - rect.left) / rect.width;
    const ny = (clientY - rect.top) / rect.height;

    return {
      x: vb.x + nx * vb.w,
      y: vb.y + ny * vb.h,
    };
  }
  private syncViewBoxFromSvg(svg: SVGSVGElement) {
    const vb = svg.getAttribute('viewBox');
    if (!vb) return;

    const nums = vb
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    if (nums.length !== 4 || nums.some((n) => !Number.isFinite(n))) return;

    const [x, y, w, h] = nums;
    this.svgRefService.viewBox = { x, y, w, h };
  }
}
