import { Component, Input } from '@angular/core';

@Component({
  selector: 'g[app-square]',
  imports: [],
  template: `
    <svg:polygon
      [attr.points]="s.polygonPoints"
      [attr.transform]="'translate(' + s.x + ',' + s.y + ')'"
      [attr.fill]="s.fillColor"
      [attr.fill-opacity]="s.fillOpacity"
      [attr.stroke]="s.strokeColor"
      [attr.stroke-opacity]="s.strokeOpacity"
      [attr.stroke-width]="s.baseStrokeWidth"
      [attr.opacity]="s.opacity"
    ></svg:polygon>
  `,
  styles: ``,
})
export class SquareComponent {
  @Input('star') s: any;
}
