import { AfterViewInit, Component, inject, Input, OnInit } from '@angular/core';

import { EventCommonMenu, eventsFromCommonMenu, FitToWindow, ZoomMode } from '../../core/common/event-common-menu';

import { CommonMenuService } from '../common-menu.service';
import { svgDataDefault } from '../../core/default/svg-data';
import { SvgData } from '../../core/common/svg-data';
import { NgClass } from '@angular/common';
export enum ChengerStateMenuButton {
  zoomIn,
  zoomOut,
}
@Component({
  selector: 'app-image-size',
  templateUrl: './image-size.component.html',
  styleUrl: './image-size.component.css',
  standalone: true,
  imports: [NgClass],
})
export class ImageSizeComponent {
  chengerStateMenuButton = ChengerStateMenuButton;
  moveActive = false;

  // ngAfterViewInit(): void {
  //   setTimeout(() => {
  //     // this.emit({ name: 'fitToWindow', fitToWindow: 'fit' });
  //   });
  // }

  @Input() dataFromSvg: SvgData = svgDataDefault;
  readonly svc = inject(CommonMenuService);

  zoomMode: ZoomMode = 'none';

  move(move: eventsFromCommonMenu): void {
    this.moveActive = true;
    this.emit({ name: move });
  }

  fitToWindow(fitToWindow: FitToWindow): void {
    this.emit({ name: 'fitToWindow', fitToWindow });
  }

  toggleZoom(mode: ZoomMode): void {
    this.zoomMode = this.zoomMode === mode ? 'none' : mode;
    this.emit({ name: 'toggleZoom', zoomMode: this.zoomMode });
  }

  private emit(ev: Partial<EventCommonMenu>) {
    this.svc.emitEv(ev);
  }
}
