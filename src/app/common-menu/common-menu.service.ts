import { inject, Injectable, signal } from '@angular/core';
import { EventCommonMenu } from '../core/common/event-common-menu';
import { SvgDataService } from '../core/services/svg-data-ref.service';

@Injectable({
  providedIn: 'root',
})
export class CommonMenuService {
  svgDataService = inject(SvgDataService);
  ev = signal(this.e);

  get e(): EventCommonMenu {
    return {
      name: 'fitToWindow',
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    };
  }
  emitEv(partialEv: Partial<EventCommonMenu>) {
    this.ev.update((ev) => Object.assign({}, this.e, partialEv));
    this.eventFromCommonMenu(this.ev());
  }

  eventFromCommonMenu(ev: EventCommonMenu) {
    switch (ev.name) {
      case 'fitToWindow':
        this.svgDataService.fitToWindow();

        break;

      case 'resetToRealSize':
        this.svgDataService.resetToRealSize();

        break;

      case 'toggleZoom':
        this.svgDataService.toggleZoom(ev.zoomMode ?? 'none');

        break;
    }
  }
}
