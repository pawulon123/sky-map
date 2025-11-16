import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { ConstellationLinesService } from '../../../services/constellation-lines.service';
import { ProjectionService } from '../../../services/projection.service';

type ProjectionName =
  | 'stereographic'
  | 'azimuthal'
  | 'azimuthalEA'
  | 'orthographic'
  | 'gnomonic'
  | 'mercator'
  | 'equirect';

@Component({
  selector: 'g[app-constellation-lines-layer]',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg:g id="layer-constellation-lines">
      <ng-container *ngFor="let d of paths()">
        <path [attr.d]="d" stroke="#06c" stroke-width="0.7" fill="none"></path>
      </ng-container>
    </svg:g>
  `,
})
export class ConstellationLinesLayerComponent implements OnInit {
  private svc = inject(ConstellationLinesService);
  private proj = inject(ProjectionService);

  ngOnInit() {
    this.svc.loadOnce();
  }

  private isRectangular = (n: ProjectionName) => n === 'equirect' || n === 'mercator';
  private raToLonForProj(n: ProjectionName, ra: number) {
    return this.isRectangular(n) ? ((((ra + 180) % 360) + 360) % 360) - 180 : ra;
  }
  private splitByDateline(n: ProjectionName, seg: [number, number][]) {
    const out: [number, number][][] = [];
    let cur: [number, number][] = [];
    let prev: number | null = null;
    for (const [ra, dec] of seg) {
      const lon = this.raToLonForProj(n, ra);
      if (prev != null && Math.abs(lon - prev) > 180) {
        if (cur.length) out.push(cur);
        cur = [];
      }
      cur.push([lon, dec]);
      prev = lon;
    }
    if (cur.length) out.push(cur);
    return out;
  }
  private makePath(pts: [number, number][]) {
    if (!pts.length) return '';
    const xy = pts.map(([lon, dec]) => this.proj.projectLonLat(lon, dec)) as [number, number][];
    let d = `M${xy[0][0]},${xy[0][1]}`;
    for (let i = 1; i < xy.length; i++) d += `L${xy[i][0]},${xy[i][1]}`;
    return d;
  }

  paths = computed(() => {
    const n = this.proj.name() as ProjectionName;
    const items = this.svc.data().items ?? [];
    const out: string[] = [];
    for (const c of items) {
      for (const seg of c.segments ?? []) {
        for (const chunk of this.splitByDateline(n, seg)) {
          const d = this.makePath(chunk);
          if (d) out.push(d);
        }
      }
    }

    return out;
  });
}
