import { Component, inject, Input, OnInit } from '@angular/core';
import { SvgData } from '../../core/common/svg-data';
import { svgDataDefault } from '../../core/default/svg-data';
import { CommonMenuService } from '../common-menu.service';
import { EventCommonMenu, FitToWindow, ZoomMode } from '../../core/common/event-common-menu';
import { ActiveMenuButtonDirective } from '../../core/directives/active-button-common-menu.directive';
export enum ChengerStateMenuButton {
  zoomIn,
  zoomOut,
}
@Component({
  selector: 'app-image-size',
  templateUrl: './image-size.component.html',
  styleUrl: './image-size.component.css',
  standalone: true,
  imports: [ActiveMenuButtonDirective],
})
export class ImageSizeComponent {
  chengerStateMenuButton = ChengerStateMenuButton;

  @Input() dataFromSvg: SvgData = svgDataDefault;
  readonly svc = inject(CommonMenuService);

  zoomMode: ZoomMode = 'none';

  resetToRealSize(fitToWindow: FitToWindow): void {
    this.emit({ name: 'fitToWindow', fitToWindow });
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
