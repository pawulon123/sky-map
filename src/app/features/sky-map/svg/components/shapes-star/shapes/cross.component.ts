import { Component, Input } from '@angular/core';

@Component({
  selector: 'g[app-cross]',
  imports: [],
  template: `
    <svg:g [attr.transform]="'translate(' + s.x + ',' + s.y + ')'" [attr.opacity]="s.opacity">
      <line
        x1="0"
        [attr.y1]="-s.r"
        x2="0"
        [attr.y2]="s.r"
        [attr.stroke]="s.strokeColor"
        [attr.stroke-opacity]="s.strokeOpacity"
        [attr.stroke-width]="s.crossStrokeWidth"
        stroke-linecap="round"
      ></line>
      <line
        [attr.x1]="-s.r"
        y1="0"
        [attr.x2]="s.r"
        y2="0"
        [attr.stroke]="s.strokeColor"
        [attr.stroke-opacity]="s.strokeOpacity"
        [attr.stroke-width]="s.crossStrokeWidth"
        stroke-linecap="round"
      ></line>
    </svg:g>
  `,
  styles: ``,
})
export class CrossComponent {
  @Input('star') s: any;
}
