import { Component, Input } from '@angular/core';

@Component({
  selector: 'g[app-ring]',
  imports: [],
  template: `
    <svg:circle
      [attr.cx]="s.x"
      [attr.cy]="s.y"
      [attr.r]="s.r"
      fill="none"
      [attr.stroke]="s.strokeColor"
      [attr.stroke-opacity]="s.strokeOpacity"
      [attr.stroke-width]="s.ringStrokeWidth"
      [attr.opacity]="s.opacity"
    ></svg:circle>
  `,
  styles: ``,
})
export class RingComponent {
  @Input('star') s: any;
}
