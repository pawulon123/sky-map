// svg-tooltip.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface TooltipService {
  visible: boolean;
  x: number;
  y: number;
  text: string | null;
}

@Injectable({ providedIn: 'root' })
export class SvgTooltipService {
  private readonly _state$ = new BehaviorSubject<TooltipService>({
    visible: false,
    x: 0,
    y: 0,
    text: null,
  });

  state$ = this._state$.asObservable();

  show(x: number, y: number, text: string) {
    this._state$.next({ visible: true, x, y, text });
  }

  hide() {
    setTimeout(() => {
      const prev = this._state$.value;
      if (!prev.visible) return;
      this._state$.next({ ...prev, visible: false });
    }, 9000);
  }
}
