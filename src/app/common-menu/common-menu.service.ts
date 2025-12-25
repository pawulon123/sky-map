import { Injectable, signal } from '@angular/core';
import { EventCommonMenu } from '../core/common/event-common-menu';

@Injectable({
  providedIn: 'root',
})
export class CommonMenuService {
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
  }
}
