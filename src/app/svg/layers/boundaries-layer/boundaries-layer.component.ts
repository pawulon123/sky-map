import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { BoundariesService } from '../../../services/boundaries.service';
import { ProjectionService } from '../../../services/projection.service';


type ProjectionName = 'stereographic'|'azimuthal'|'azimuthalEA'|'orthographic'|'gnomonic'|'mercator'|'equirect';

@Component({
  selector: 'g[app-boundaries-layer]',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg:g id="layer-boundaries">
      <ng-container *ngFor="let d of paths()">
        <path [attr.d]="d" stroke="#000" stroke-width="0.6" fill="none"></path>
      </ng-container>
    </svg:g>
  `,
})
export class BoundariesLayerComponent implements OnInit {
  private svc = inject(BoundariesService);
  private proj: ProjectionService  = inject(ProjectionService);

  ngOnInit() { this.svc.loadOnce(); }

  // --- helpers ---
  private isRectangular(name: ProjectionName) {
    return name === 'equirect' || name === 'mercator';
  }
  private raToLonForProj(name: ProjectionName, raDeg: number) {
    // dla prostokątnych mapujemy RA [0..360) → lon [-180,180)
    if (this.isRectangular(name)) {
      const lon = ((raDeg + 180) % 360 + 360) % 360 - 180;
      return lon;
    }
    // dla azymutalnych zostawiamy tak jak jest (pracujesz już „po właściwej stronie”)
    return raDeg;
  }
  private splitByDateline(name: ProjectionName, seg: [number, number][]) {
    // tnie po Δlon > 180° (po zamianie RA→lon)
    const out: [number, number][][] = [];
    let cur: [number, number][] = [];
    let prevLon: number | null = null;

    for (const [ra, dec] of seg) {
      const lon = this.raToLonForProj(name, ra);
      if (prevLon != null) {
        const d = Math.abs(lon - prevLon);
        if (d > 180) {
          // zamknij poprzednią część
          if (cur.length) out.push(cur);
          cur = [];
        }
      }
      cur.push([lon, dec]);
      prevLon = lon;
    }
    if (cur.length) out.push(cur);
    return out;
  }
  private makePath(pts: [number, number][]): string {
    if (pts.length === 0) return '';
    const xy = pts
      .map(([lon, dec]) => this.proj.projectLonLat(lon, dec))
      .filter(Boolean) as [number, number][];
    if (!xy.length) return '';
    // Szybciej niż d3.line dla prostych segmentów:
    let d = `M${xy[0][0]},${xy[0][1]}`;
    for (let i = 1; i < xy.length; i++) d += `L${xy[i][0]},${xy[i][1]}`;
    return d;
  }

  // --- ścieżki do rysowania ---
  paths = computed(() => {
    const name = this.proj.name() as ProjectionName;
    const all = this.svc.data().boundaries ?? [];
    const out: string[] = [];
    for (const b of all) {
      const segs = b.segments ?? [];
      for (const seg of segs) {
        // 1) potnij przy ±180
        const chunks = this.splitByDateline(name, seg);
        // 2) przelicz na XY i złóż d
        for (const ch of chunks) {
          const d = this.makePath(ch);
          if (d) out.push(d);
        }
      }
    }
    return out;
  });
}
