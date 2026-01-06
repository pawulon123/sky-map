import { Injectable, computed, inject } from '@angular/core';
import { ConstellationLinesService, ConstellationLine } from '../../domain/services/constellation-lines/constellation-lines.service';

type RaDec = [number, number];
type XY = [number, number];

export interface ConstellationPanelVM {
  id: string;
  constelationId: string;
  name?: string;
  abbrev: string;

  x: number;
  y: number;
  w: number;
  h: number;

  clipId: string;
  transform: string;
  paths: string[];

  // opcjonalnie: label w panelu
  label?: { x: number; y: number; text: string };
}

export interface ConstellationPanelsLayoutVM {
  totalW: number;
  totalH: number;
  panels: ConstellationPanelVM[];
}

@Injectable({ providedIn: 'root' })
export class ConstellationPanelsLayoutService {
  private lines = inject(ConstellationLinesService);

  // Panel 30x30 cm => 300x300 jednostek SVG (umownie: 1 jednostka = 1 mm)
  private readonly PANEL = 300;
  private readonly GAP = 10;
  private readonly PAD = 40;

  // Ile paneli w wierszu. Zmień na 8 jeśli chcesz “8 w rzędzie”.
  private readonly COLS = 8;

  constructor() {
    // ważne: ładowanie danych
    void this.lines.loadOnce().catch(err => console.error('ConstellationLines loadOnce failed', err));
  }

  readonly layout = computed<ConstellationPanelsLayoutVM>(() => {
    // zależność od loaded/data
    const loaded = this.lines.loaded();
    const items = this.lines.data().items ?? [];
    if (!loaded || items.length === 0) {
      return { totalW: this.PANEL, totalH: this.PANEL, panels: [] };
    }

    // sort opcjonalny: alfabetycznie po skrócie lub ID
    const sorted = [...items].sort((a, b) => (a.abbrev ?? '').localeCompare(b.abbrev ?? ''));

    const rows = Math.ceil(sorted.length / this.COLS);
    const totalW = this.COLS * this.PANEL + (this.COLS - 1) * this.GAP;
    const totalH = rows * this.PANEL + (rows - 1) * this.GAP;

    const panels = sorted.map((c, i) => this.buildPanel(c, i));

    return { totalW, totalH, panels };
  });

  private buildPanel(c: ConstellationLine, i: number): ConstellationPanelVM {
    const col = i % this.COLS;
    const row = Math.floor(i / this.COLS);

    const x0 = col * (this.PANEL + this.GAP);
    const y0 = row * (this.PANEL + this.GAP);

    const id = `panel-${c.constelationId}`;
    const clipId = `clip-${id}`;

    // 1) Wyznacz środek RA odporny na wrap (średnia na okręgu)
    const raCenter = this.computeRaCenter(c.segments ?? []);

    // 2) Zamień RA/Dec -> XY w lokalnym układzie panelu
    //    x = ΔRA w [-180,180] wokół raCenter
    //    y = -Dec (żeby północ była “do góry” w SVG)
    const segsXY: XY[][] = (c.segments ?? [])
      .map(seg => seg.map(([ra, dec]) => {
        const dx = this.wrapDeltaRa(ra, raCenter);
        const dy = -dec;
        return [dx, dy] as XY;
      }))
      .filter(seg => seg.length >= 2);

    const bbox = this.computeBBox(segsXY);
    if (!bbox) {
      return {
        id,
        constelationId: c.constelationId,
        name: c.name,
        abbrev: c.abbrev,
        x: x0, y: y0, w: this.PANEL, h: this.PANEL,
        clipId,
        transform: `translate(${x0},${y0})`,
        paths: [],
      };
    }

    const innerW = this.PANEL - 2 * this.PAD;
    const innerH = this.PANEL - 2 * this.PAD;

    const w0 = bbox.maxX - bbox.minX;
    const h0 = bbox.maxY - bbox.minY;

    const safeW = Math.max(1e-9, w0);
    const safeH = Math.max(1e-9, h0);

    const s = Math.min(innerW / safeW, innerH / safeH);

    const scaledW = w0 * s;
    const scaledH = h0 * s;

    const dx = (innerW - scaledW) / 2;
    const dy = (innerH - scaledH) / 2;

    // transform: przeniesienie do panelu + padding + centrowanie, skala, przesunięcie bbox do (0,0)
    const transform = [
      `translate(${x0 + this.PAD + dx},${y0 + this.PAD + dy})`,
      `scale(${s})`,
      `translate(${-bbox.minX},${-bbox.minY})`,
    ].join(' ');

    const paths = segsXY.map(seg => this.segmentToPath(seg));

    // label w panelu (opcjonalnie)
    const label = { x: x0 + 8, y: y0 + 18, text: c.abbrev ?? c.constelationId };

    return {
      id,
      constelationId: c.constelationId,
      name: c.name,
      abbrev: c.abbrev,
      x: x0, y: y0, w: this.PANEL, h: this.PANEL,
      clipId,
      transform,
      paths,
      label,
    };
  }

  private computeRaCenter(segments: RaDec[][]): number {
    const pts: RaDec[] = segments.flat();
    if (!pts.length) return 0;

    let sx = 0;
    let sy = 0;

    for (const [ra] of pts) {
      const a = (ra * Math.PI) / 180;
      sx += Math.cos(a);
      sy += Math.sin(a);
    }

    const ang = Math.atan2(sy, sx);
    const deg = (ang * 180) / Math.PI;
    return (deg + 360) % 360;
  }

  private wrapDeltaRa(ra: number, center: number): number {
    // wynik w [-180,180]
    return ((((ra - center) % 360) + 540) % 360) - 180;
  }

  private computeBBox(segs: XY[][]): { minX: number; minY: number; maxX: number; maxY: number } | null {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let any = false;

    for (const seg of segs) {
      for (const [x, y] of seg) {
        any = true;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
    return any ? { minX, minY, maxX, maxY } : null;
  }

  private segmentToPath(seg: XY[]): string {
    // Jedna ścieżka na segment: M x y L x y L ...
    const [p0, ...rest] = seg;
    const head = `M${p0[0]},${p0[1]}`;
    const tail = rest.map(p => `L${p[0]},${p[1]}`).join(' ');
    return tail ? `${head} ${tail}` : head;
  }
}
