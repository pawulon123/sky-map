import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkyMapPageComponent } from './features/sky-map/sky-map-page/sky-map-page.component';
import { SvgData } from './core/common/svg-data';
import { exportSvg } from './common-menu/export/export-svg';
import { svgDataDefault } from './core/default/svg-data';
import { SvgTooltipComponent } from './core/tooltip/tooltip.component';
import { CommonMenuComponent } from './common-menu/common-menu.component';

type ZoomMode = 'none' | 'in' | 'out';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SkyMapPageComponent, SvgTooltipComponent, CommonMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  dataFromSvg: SvgData = svgDataDefault;

  eventFromCommonMenu: any;

  // @HostListener('window:resize')
  // onWindowResize() {
  //   if (this.fitMode) this.fitToWindow();
  // }

  // onSvgClick(e: MouseEvent): void {
  //   if (this.zoomMode === 'none') return;

  //   const factor = this.zoomMode === 'in' ? 1.25 : 1 / 1.25;
  //   this.zoomAt(e.clientX, e.clientY, factor);
  // }

  // onSvgWheel(e: WheelEvent): void {
  //   // Jeżeli nie zoomujesz, pozwól na normalny scroll kontenera
  //   if (this.zoomMode === 'none') return;

  //   e.preventDefault();

  //   const zoomIn = e.deltaY < 0;
  //   const factor = zoomIn ? 1.1 : 1 / 1.1;
  //   this.zoomAt(e.clientX, e.clientY, factor);
  // }

  // private zoomAt(clientX: number, clientY: number, factor: number): void {
  //   const svg = this.svgData.svgRef?.nativeElement;
  //   if (!svg) return;

  //   const pt = svg.createSVGPoint();
  //   pt.x = clientX;
  //   pt.y = clientY;

  //   const ctm = svg.getScreenCTM();
  //   if (!ctm) return;

  //   const p = pt.matrixTransform(ctm.inverse());

  //   const rx = (p.x - this.vb.x) / this.vb.w;
  //   const ry = (p.y - this.vb.y) / this.vb.h;

  //   const newW = this.vb.w / factor;
  //   const newH = this.vb.h / factor;

  //   const minW = this.svgData.width / 20;
  //   const maxW = this.svgData.width * 2;

  //   const clampedW = this.clamp(newW, minW, maxW);

  //   const aspect = this.svgData.height / this.svgData.width;
  //   const clampedH = this.clamp(newH, minW * aspect, maxW * aspect);

  //   const newX = p.x - rx * clampedW;
  //   const newY = p.y - ry * clampedH;

  //   const maxX = this.svgData.width - clampedW;
  //   const maxY = this.svgData.height - clampedH;

  //   this.vb = {
  //     x: this.clamp(newX, 0, Math.max(0, maxX)),
  //     y: this.clamp(newY, 0, Math.max(0, maxY)),
  //     w: clampedW,
  //     h: clampedH,
  //   };
  // }

  // private clamp(v: number, min: number, max: number): number {
  //   return Math.min(max, Math.max(min, v));
  // }
}
