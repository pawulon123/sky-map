import { Injectable } from '@angular/core';
import { SvgDataService } from './svg-data-ref.service';
import { BehaviorSubject } from 'rxjs';
import { ZoomTool } from '../../features/sky-map/svg/root-svg/zoom-svg.service';
export interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}
@Injectable({
  providedIn: 'root',
})
export class ZoomSvgService extends SvgDataService {
  //       private projWidth = 100;
  //   private projHeight = 100;
  //    private readonly zoomToolSub = new BehaviorSubject<ZoomTool>('none');
  //   toggleZoom(tool:ZoomTool) {
  //     this.zoomToolSub.next(tool);
  //   }
  //     private readonly viewBoxSub = new BehaviorSubject<ViewBox>({ x: 0, y: 0, w: 100, h: 100 });
  //   get viewBoxValue(): ViewBox {
  //     return this.viewBoxSub.value;
  //   }
  //    zoomAtClientPoint( direction: 'in' | 'out', factor = 1.4) {
  //     // console.log(clientX);
  // const clientX = this.mouseEvent.clientX
  // const  clientY = this.mouseEvent.clientY
  //     if (!this.svgData.svgRef) return;
  //     const svg = this.svgData.svgRef.nativeElement;
  //     const vb = this.viewBoxValue;
  //     const pt = svg.createSVGPoint();
  //     pt.x = clientX;
  //     pt.y = clientY;
  //     const ctm = svg.getScreenCTM();
  //     if (!ctm) return;
  //     const svgPoint = pt.matrixTransform(ctm.inverse());
  //     const px = svgPoint.x;
  //     const py = svgPoint.y;
  //     const f = direction === 'in' ? factor : 1 / factor;
  //     // ograniczenia zoomu (przykład)
  //     const MIN_W = this.projWidth / 50; // max ~50x
  //     const MAX_W = this.projWidth;      // nie dalej niż pełny widok
  //     let newW = vb.w * f;
  //     newW = Math.max(MIN_W, Math.min(MAX_W, newW));
  //     const aspect = vb.h / vb.w;
  //     let newH = newW * aspect;
  //     // zachowaj proporcje do projekcji, jeśli wolisz:
  //     // const projAspect = this.projHeight / this.projWidth;
  //     // newH = newW * projAspect;
  //     // Pozycja kliknięcia jako ułamek w viewBox
  //     const rx = (px - vb.x) / vb.w;
  //     const ry = (py - vb.y) / vb.h;
  //     // Nowy viewBox tak, by kliknięty punkt pozostał pod kursorem
  //     let newX = px - rx * newW;
  //     let newY = py - ry * newH;
  //     // Clamp do granic mapy
  //     if (newW >= this.projWidth) {
  //       newW = this.projWidth;
  //       newX = 0;
  //     } else {
  //       newX = Math.max(0, Math.min(this.projWidth - newW, newX));
  //     }
  //     if (newH >= this.projHeight) {
  //       newH = this.projHeight;
  //       newY = 0;
  //     } else {
  //       newY = Math.max(0, Math.min(this.projHeight - newH, newY));
  //     }
  // // console.log(newW, newH, newX, newY);
  //     this.viewBoxSub.next({ x: newX, y: newY, w: newW, h: newH });
  //   }
}
