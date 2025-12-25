import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkyMapPageComponent } from './features/sky-map/sky-map-page/sky-map-page.component';
import { SvgData } from './core/common/svg-data';
import { svgDataDefault } from './core/default/svg-data';
import { SvgTooltipComponent } from './core/tooltip/tooltip.component';
import { CommonMenuComponent } from './common-menu/common-menu.component';
import { EventCommonMenu, ZoomMode } from './core/common/event-common-menu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SkyMapPageComponent, SvgTooltipComponent, CommonMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  dataFromSvg: SvgData = svgDataDefault;

  // stan zoom
  zoomMode: ZoomMode = 'none';

  // aktualny viewBox
  private vb = { x: 0, y: 0, w: 0, h: 0 };

  // “siła” zoom
  private readonly zoomFactor = 1.25;

  // handler kliknięcia SVG (żeby móc go odpiąć)
  private readonly svgClickHandler = (evt: MouseEvent) => this.onSvgClick(evt);

  eventFromCommonMenu(ev: EventCommonMenu) {
    switch (ev.name) {
      case 'fitToWindow':
        this.fitToWindow();

        break;

      case 'resetToRealSize':
        this.resetToRealSize();

        break;

      case 'toggleZoom':
        this.toggleZoom(ev.zoomMode ?? 'none');
        this.zoomMode === 'none' ? this.removwClick() : this.attachSvgClickListener();
        break;
    }
  }

  setDataFromSvg(svgData: SvgData) {
    this.dataFromSvg = svgData;

    // ustaw viewBox i “pełny” stan vb
    this.createViewBox();

    // podepnij klik do SVG (raz, bez duplikowania listenerów)
  }

  private createViewBox() {
    const w = this.dataFromSvg.width;
    const h = this.dataFromSvg.height;

    const svg = this.dataFromSvg.svgRef?.nativeElement;
    if (!svg) return;

    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('width', `${w}`);
    svg.setAttribute('height', `${h}`);

    this.vb = { x: 0, y: 0, w, h };
  }

  private attachSvgClickListener() {
    const svg = this.dataFromSvg.svgRef?.nativeElement;
    console.log('click');

    if (!svg) return;

    // zdejmij poprzedni (gdyby svgRef się zmienił)
    svg.removeEventListener('click', this.svgClickHandler);
    svg.addEventListener('click', this.svgClickHandler);
  }
  removwClick() {
    const svg = this.dataFromSvg.svgRef?.nativeElement;
    console.log('UnClick');

    if (!svg) return;

    // zdejmij poprzedni (gdyby svgRef się zmienił)
    svg.removeEventListener('click', this.svgClickHandler);
    // svg.addEventListener('click', this.svgClickHandler);
  }

  private toggleZoom(mode: ZoomMode) {
    this.zoomMode = mode;
  }

  // maksymalny zoom-out (ile razy większy viewBox niż content)
  private readonly maxZoomOut = 6; // np. 6x – ustaw jak chcesz

  private onSvgClick(evt: MouseEvent) {
    
    if (this.zoomMode === 'none') return;

    const svg = this.dataFromSvg.svgRef?.nativeElement;
    if (!svg) return;

    const p = this.clientPointToSvg(svg, evt.clientX, evt.clientY);

    const contentW = this.dataFromSvg.width;
    const contentH = this.dataFromSvg.height;

    // nowe w/h
    let w2 = this.vb.w;
    let h2 = this.vb.h;

    if (this.zoomMode === 'in') {
      w2 = this.vb.w / this.zoomFactor;
      h2 = this.vb.h / this.zoomFactor;
    } else if (this.zoomMode === 'out') {
      w2 = this.vb.w * this.zoomFactor;
      h2 = this.vb.h * this.zoomFactor;
    }

    // minimalny zoom-in (żeby nie zejść do zera)
    const minSize = 10;

    // maksymalny zoom-out (TU jest klucz)
    const maxW = contentW * this.maxZoomOut;
    const maxH = contentH * this.maxZoomOut;

    w2 = Math.max(minSize, Math.min(w2, maxW));
    h2 = Math.max(minSize, Math.min(h2, maxH));

    // proporcja kliknięcia w bieżącym viewBox
    const rx = (p.x - this.vb.x) / this.vb.w;
    const ry = (p.y - this.vb.y) / this.vb.h;

    // nowe x/y tak, by punkt kliknięcia pozostał "pod kursorem"
    let x2 = p.x - rx * w2;
    let y2 = p.y - ry * h2;

    // clamp tak, żeby content pozostawał w viewBox:
    // gdy w2 > contentW, dozwolone x jest w [contentW - w2, 0]
    const minX = Math.min(0, contentW - w2);
    const maxX = Math.max(0, contentW - w2);
    const minY = Math.min(0, contentH - h2);
    const maxY = Math.max(0, contentH - h2);

    x2 = Math.max(minX, Math.min(x2, maxX));
    y2 = Math.max(minY, Math.min(y2, maxY));

    this.vb = { x: x2, y: y2, w: w2, h: h2 };
    svg.setAttribute('viewBox', `${x2} ${y2} ${w2} ${h2}`);
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
    const width = this.dataFromSvg.width;
    const height = this.dataFromSvg.height;
    const svg = this.dataFromSvg.svgRef?.nativeElement;
    if (!svg) return;

    svg.setAttribute('width', `${width}`);
    svg.setAttribute('height', `${height}`);
    this.vb = { x: 0, y: 0, w: width, h: height };
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  }

  fitToWindow() {
    const width = this.dataFromSvg.width;
    const height = this.dataFromSvg.height;

    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;

    const toolbarH = 0;

    const maxW = innerWidth;
    const maxH = Math.max(0, (innerHeight ?? 0) - toolbarH);

    const s = Math.min(maxW / width, maxH / height);

    const svg = this.dataFromSvg.svgRef?.nativeElement;
    if (!svg) return;

    svg.setAttribute('width', `${Math.floor(width * s)}`);
    svg.setAttribute('height', `${Math.floor(height * s)}`);
  }
}
