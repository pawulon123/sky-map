import { Component, inject, Input, OnInit } from '@angular/core';
import { SvgData } from '../../core/common/svg-data';
import { svgDataDefault } from '../../core/default/svg-data';
import { CommonMenuService } from '../common-menu.service';
import { ZoomMode } from '../../core/common/event-common-menu';

@Component({
  selector: 'app-image-size',
  imports: [],
  templateUrl: './image-size.component.html',
  styleUrl: './image-size.component.css',
})
export class ImageSizeComponent implements OnInit {
  @Input() dataFromSvg: SvgData = svgDataDefault;
  readonly svc = inject(CommonMenuService);

  zoomMode: ZoomMode = 'none';

  ngOnInit(): void {
    this.resetToRealSize();
  }

  resetToRealSize(): void {
    this.svc.emitEv({ name: 'resetToRealSize' });
  }

  fitToWindow(): void {
    this.svc.emitEv({ name: 'fitToWindow' });
  }

  toggleZoom(mode: ZoomMode): void {
    this.zoomMode = this.zoomMode === mode ? 'none' : mode;

    this.svc.emitEv({
      name: 'toggleZoom',
      zoomMode: this.zoomMode,
    });
  }
}
