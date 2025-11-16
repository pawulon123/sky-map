import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { BoundariesService } from '../../../services/boundaries.service';
import { ProjectionService } from '../../../services/projection.service';

@Component({
  selector: 'g[app-boundaries-layer]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'boundaries-layer.component.html',
})
export class BoundariesLayerComponent implements OnInit {
  private svc = inject(BoundariesService);
  private proj = inject(ProjectionService);

  ngOnInit() {
    this.svc.loadOnce();
  }

  /**
   * Rzutuje punkt RA/Dec na ekran w pikselach, z takim samym mirrorem X,
   * jak robimy dla gwiazd.
   */
  private projectStarStyle(raDeg: number, decDeg: number): [number, number] | null {
    const p = this.proj.projectRaDec(raDeg, decDeg);
    if (!p) return null;

    const w = this.proj.width();
    let [x, y] = p;
    x = w - x; // RA rośnie w lewo, tak jak w warstwie gwiazd
    return [x, y];
  }

  /**
   * Dany segment granicy to tablica punktów [ [ra,dec], [ra,dec], ... ].
   *
   * Zwracamy tablicę POD-ścieżek, ale już w przestrzeni ekranu:
   * [
   *   [ [x0,y0], [x1,y1], ... ],
   *   [ [xk,yk], [xk+1,yk+1], ... ],
   *   ...
   * ]
   *
   * Robimy własne cięcie tam, gdzie następuje wrap przez brzeg mapy:
   * jeśli |x - prevX| > width * 0.5 → nowa pod-ścieżka.
   */
  private segmentToScreenChunks(segRaDec: [number, number][]): [number, number][][] {
    const w = this.proj.width();
    const maxJump = w * 0.5;

    const chunks: [number, number][][] = [];
    let current: [number, number][] = [];

    let prevPt: [number, number] | null = null;

    for (const [ra, dec] of segRaDec) {
      const screenPt = this.projectStarStyle(ra, dec);
      if (!screenPt) {
        // punkt wypadł poza projekcję -> przerwij bieżącą kreskę
        if (current.length) {
          chunks.push(current);
          current = [];
        }
        prevPt = null;
        continue;
      }

      const [x, y] = screenPt;

      if (prevPt) {
        const [px, py] = prevPt;
        const dx = Math.abs(x - px);

        // jeśli skok po X jest ogromny, traktujemy to jako przejście
        // przez +/-180° i zaczynamy nowy pod-segment
        if (dx > maxJump) {
          if (current.length) {
            chunks.push(current);
          }
          current = [];
        }
      }

      current.push([x, y]);
      prevPt = [x, y];
    }

    if (current.length) {
      chunks.push(current);
    }

    return chunks;
  }

  /**
   * Na podstawie chunków [ [x,y], ...] budujemy atrybut d="M...L..."
   */
  private chunkToPathD(chunkXY: [number, number][]): string {
    if (chunkXY.length < 2) return '';
    let d = `M${chunkXY[0][0]},${chunkXY[0][1]}`;
    for (let i = 1; i < chunkXY.length; i++) {
      d += `L${chunkXY[i][0]},${chunkXY[i][1]}`;
    }
    return d;
  }

  /**
   * Główne computed: lista pathów gotowych do <path d="..."/>.
   *
   * Ważne:
   * - NIE rozbijamy już segmentów po różnicy RA (to było niestabilne po mirrorze).
   * - Rozbijamy po różnicy X na ekranie (dx > połowa szerokości),
   *   więc "teleport" w mercatorze/equirect już nie zrobi potwornego
   *   cięcia przez cały widok.
   * - Używamy dokładnie takiego samego mirrora X jak gwiazdy.
   */
  paths = computed(() => {
    const boundaries = this.svc.data().boundaries ?? [];
    const out: string[] = [];

    for (const boundary of boundaries) {
      const segs = boundary.segments ?? [];

      for (const segRaDec of segs) {
        // rzutuj ten segment do przestrzeni ekranu i potnij wg dużych skoków
        const chunks = this.segmentToScreenChunks(segRaDec);

        // każdy chunk zamieniamy na jedną ścieżkę SVG
        for (const c of chunks) {
          const d = this.chunkToPathD(c);
          if (d) out.push(d);
        }
      }
    }

    return out;
  });
}
