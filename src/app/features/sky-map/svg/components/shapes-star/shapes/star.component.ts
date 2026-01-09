import { Component, Input } from '@angular/core';

@Component({
  selector: 'g[app-star]',
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
export class StarComponent {
  s: any;
  @Input() set star(s: any) {
    const polygonPoints = this.points(s.r);
    this.s = { ...s, polygonPoints };
  }

  private points(r: number): string {
    const outer = r;
    const inner = outer * 0.4;
    const pts: string[] = [];
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI / 5) * i - Math.PI / 2;
      const rr = i % 2 === 0 ? outer : inner;
      const x = Math.cos(angle) * rr;
      const y = Math.sin(angle) * rr;
      pts.push(`${x},${y}`);
    }
    return pts.join(' ');
  }
}
