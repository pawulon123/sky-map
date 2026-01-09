import { Component, Input } from '@angular/core';

@Component({
  selector: 'g[app-circle]',
  imports: [],
  template: `
    <svg:circle
      [attr.cx]="s.x"
      [attr.cy]="s.y"
      [attr.r]="s.r"
      [attr.fill]="s.fillColor"
      [attr.fill-opacity]="s.fillOpacity"
      [attr.stroke]="s.strokeColor"
      [attr.stroke-opacity]="s.strokeOpacity"
      [attr.stroke-width]="s.baseStrokeWidth"
      [attr.opacity]="s.opacity"
    ></svg:circle>
  `,
  styles: ``,
})
export class CircleComponent {
  @Input('star') s: any;
}
