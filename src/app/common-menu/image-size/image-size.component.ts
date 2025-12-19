import { Component, inject, Input, OnInit } from '@angular/core';
import { SvgData } from '../../core/common/svg-data';
import { svgDataDefault } from '../../core/default/svg-data';
import { CommonMenuService } from '../common-menu.service';
import { log } from 'console';
type ZoomMode = 'none' | 'in' | 'out';

@Component({
  selector: 'app-image-size',
  imports: [],
  templateUrl: './image-size.component.html',
  styleUrl: './image-size.component.css',
})
export class ImageSizeComponent implements OnInit {
  @Input() dataFromSvg: SvgData = svgDataDefault;
  readonly svc = inject(CommonMenuService);

  private vb = { x: 0, y: 0, w: this.dataFromSvg.width, h: this.dataFromSvg.height };
  zoomMode: string = '';
  ngOnInit(): void {
    this.resetToRealSize();
    this.resetViewBox();
  }

  resetToRealSize(): void {
    this.svc.emitEv({ name: 'resetToRealSize' });
  }

  resetViewBox(): void {
    this.vb = { x: 0, y: 0, w: this.dataFromSvg.width, h: this.dataFromSvg.height };
  }

  fitToWindow(): void {
    this.svc.emitEv({ name: 'fitToWindow' });
  }
  setZoomMode(mode: ZoomMode): void {
    this.zoomMode = mode;
  }
}
