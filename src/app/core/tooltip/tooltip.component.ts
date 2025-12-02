// svg-tooltip.component.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { SvgTooltipService } from './tooltip.service';

@Component({
  selector: 'app-svg-tooltip',
  standalone: true,
  imports: [NgIf, AsyncPipe],
  templateUrl: './tooltip.component.html',
  styles: [
    `
      .svg-tooltip {
        position: fixed;
        pointer-events: none;
        padding: 4px 8px;
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        font-size: 11px;
        z-index: 9999;
        white-space: nowrap;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgTooltipComponent {
  constructor(public tooltip: SvgTooltipService) {}
}
