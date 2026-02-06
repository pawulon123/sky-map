import { inject, Injectable, signal } from '@angular/core';
import { EventCommonMenu } from '../core/common/event-common-menu';
import { ZoomService } from '../core/services/zoom-service.service';
import { PanService } from '../core/services/pan.service';
import { SvgDataService } from '../core/services/svg-data-ref.service';
import { renderDefaultSettings } from '../core/default/render-default';

@Injectable({
  providedIn: 'root',
})
export class CommonMenuService {
  zoomService = inject(ZoomService);
  svgDataService = inject(SvgDataService);
  panService = inject(PanService);
  ev = signal(this.e);

  get e(): EventCommonMenu {
    return renderDefaultSettings;
  }
  emitEv(partialEv: Partial<EventCommonMenu>) {
    this.ev.update((ev) => Object.assign({}, this.e, partialEv));
    this.eventFromCommonMenu(this.ev());
  }

  eventFromCommonMenu(ev: EventCommonMenu) {
    switch (ev.name) {
      case 'fitToWindow':
        this.svgDataService.ev(this.ev());
        break;
      case 'toggleZoom':
        this.zoomService.ev(this.ev());
        break;
      case 'move':
        this.panService.ev(this.ev());
        break;
    }
  }
}
