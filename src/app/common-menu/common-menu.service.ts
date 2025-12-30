import { inject, Injectable, signal } from '@angular/core';
import { EventCommonMenu } from '../core/common/event-common-menu';
import { ZoomService } from '../core/services/zoom-service.service';
import { FitToWindowService } from '../core/services/fit-to-window.service';
import { PanService } from '../core/services/pan.service';

@Injectable({
  providedIn: 'root',
})
export class CommonMenuService {
  zoomService = inject(ZoomService);
  fitToWindowService = inject(FitToWindowService);
  panService = inject(PanService);
  ev = signal(this.e);

  get e(): EventCommonMenu {
    return {
      name: 'fitToWindow',
    };
  }
  emitEv(partialEv: Partial<EventCommonMenu>) {
    this.ev.update((ev) => Object.assign({}, this.e, partialEv));
    this.eventFromCommonMenu(this.ev());
  }

  eventFromCommonMenu(ev: EventCommonMenu) {
    switch (ev.name) {
      case 'fitToWindow':
        this.fitToWindowService.ev(this.ev());

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
