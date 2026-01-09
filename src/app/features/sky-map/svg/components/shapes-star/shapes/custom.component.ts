import { Component, Input } from '@angular/core';

@Component({
  selector: 'g[app-custom]',
  imports: [],
  template: `
    <svg:g [attr.transform]="'translate(' + s.x + ',' + s.y + ') ' + s.customTransform" [attr.opacity]="s.opacity">
      <!-- PRZYKŁAD: możesz tu wstawić dowolny path -->
      <path
        d="M0,0 L1,0 L1,1 L0,1 Z"
        [attr.fill]="s.fillColor"
        [attr.fill-opacity]="s.fillOpacity"
        [attr.stroke]="s.strokeColor"
        [attr.stroke-opacity]="s.strokeOpacity"
        [attr.stroke-width]="s.baseStrokeWidth"
      ></path>
    </svg:g>
  `,
  styles: ``,
})
export class CustomComponent {
  @Input('star') s: any;
}
