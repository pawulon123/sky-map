import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonMenuService {
  ev = signal(this.e);

  get e() {
    return {
      name: 'fitToWindow',
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    };
  }
  emitEv(partialEv: any) {
    this.ev.update((ev) => Object.assign({}, this.e, partialEv));
  }
}
