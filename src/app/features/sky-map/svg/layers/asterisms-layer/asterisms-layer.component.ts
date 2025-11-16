import { Component, computed, inject, OnInit } from '@angular/core';
import { ProjectionService } from '../../../domain/services/projection/projection.service';
import { ProjectionName } from '../../../domain/models/projection-options.model';
import { AsterismsService } from '../../../domain/services/asterisms/asterisms.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'g[app-asterisms-layer]',
  imports: [CommonModule],
  templateUrl: './asterisms-layer.component.html',
  styleUrl: './asterisms-layer.component.css',
})
export class AsterismsLayerComponent implements OnInit {
  private svc = inject(AsterismsService);
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
    const xy = pts.map(([lon, dec]) => this.proj.getProjectionByLonLat(lon, dec)) as [number, number][];
    let d = `M${xy[0][0]},${xy[0][1]}`;
    for (let i = 1; i < xy.length; i++) d += `L${xy[i][0]},${xy[i][1]}`;
    return d;
  }

  paths = computed(() => {
    const n = this.proj.settings().projectionName as ProjectionName;
    const items = this.svc.data().items ?? [];
    const out: string[] = [];
    for (const a of items) {
      for (const seg of a.segments ?? []) {
        for (const chunk of this.splitByDateline(n, seg)) {
          const d = this.makePath(chunk);
          if (d) out.push(d);
        }
      }
    }
    return out;
  });
}
