import { Injectable, inject } from '@angular/core';
import { Star } from '../../../domain/models/star.model';
import { LabelPlacement, StarsLabelsSettings, PositionKey } from '../../../domain/models/stars-layer-settings.model';
import { ConstellationPanelsLayoutService } from '../constellation-panels-layout.service';
import { LabelsLayoutStrategy } from './labels-layout-strategy';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';

type Rect = { l: number; t: number; r: number; b: number };

@Injectable({ providedIn: 'root' })
export class PanelsLabelsLayoutService implements LabelsLayoutStrategy {
  private panelsLayout = inject(ConstellationPanelsLayoutService);
  private state = inject(SkyMapStateService);

  computeLabelLayout(getLines: (star: Star) => string[]): LabelPlacement[] {
    const settings: StarsLabelsSettings = this.state.getStarSettings().labels;
    if (!settings.visible) return [];

    const layout = this.panelsLayout.layout();
    const placements: LabelPlacement[] = [];

    const fontSize = Number(settings.fontSize ?? 10);
    const letterSpacing = Number(settings.letterSpacing ?? 0);
    const offsetPx = Number(settings.offsetPx ?? 3);

    const [magMin, magMax] = settings.magnitudeRange ?? [-99, 99];

    // SVG heurystyka (bez pomiaru DOM)
    const charW = fontSize * 0.6 + letterSpacing;

    // preferowana pozycja startowa
    const order = this.normalizeOrder(settings.position);

    // === KOLIZJE wg Twoich zasad ===
    // null => brak kolizji w ogóle
    const collisionsEnabled = settings.colision !== null;
    // jeśli kolizje włączone (czyli tablica nie-null), to domyślnie: ramka+etykiety
    const checkPanelEdge = collisionsEnabled;
    const checkLabels = collisionsEnabled;

    // bufory (na start 0; możesz podstroić)
    const panelPad = 0;
    const labelPad = 0;

    for (const p of layout.panels) {
      const panelRect: Rect = {
        l: p.x + panelPad,
        t: p.y + panelPad,
        r: p.x + p.w - panelPad,
        b: p.y + p.h - panelPad,
      };

      const occupied: Rect[] = [];

      const starsSorted = [...(p.stars ?? [])].sort((a: any, b: any) => (this.magOf(a) ?? 99) - (this.magOf(b) ?? 99));

      for (const rs of starsSorted) {
        const star = rs.star as Star;

        // filtr magnitudo
        const mag = this.magOf(rs, star);
        if (mag != null && Number.isFinite(mag)) {
          if (mag < magMin || mag > magMax) continue;
        }

        const lines = getLines(star);
        if (!lines || lines.length === 0) continue;

        const rStar = (rs as any).r ?? 2;

        const box = this.measureLabel(lines, fontSize, charW);

        const candidates = this.buildCandidates(rs.x, rs.y, rStar, box, fontSize, offsetPx, order);

        // A) brak kolizji: bierz pierwszy kandydat i nie sprawdzaj nic
        if (!collisionsEnabled) {
          const c = candidates[0];
          placements.push({ star, x: c.x, y: c.y, positionKey: c.key });
          continue;
        }

        // B) kolizje: najpierw brzeg panelu
        const fits = !checkPanelEdge ? candidates : candidates.filter((c) => this.contains(panelRect, c.rect));
        if (fits.length === 0) continue;

        // C) potem kolizje z innymi etykietami
        const best = !checkLabels
          ? fits[0]
          : fits.find(
              (c) => !occupied.some((o) => this.intersects(this.inflate(o, labelPad), this.inflate(c.rect, labelPad)))
            );

        if (!best) continue;

        occupied.push(best.rect);
        placements.push({ star, x: best.x, y: best.y, positionKey: best.key });
      }
    }

    return placements;
  }

  // -------- helpers --------

  private magOf(rs: any, star?: Star): number | null {
    const m = rs?.mag ?? star?.mag ?? null;
    return typeof m === 'number' && Number.isFinite(m) ? m : null;
  }

  private normalizeOrder(position: any): PositionKey[] {
    const all: PositionKey[] = ['right', 'left', 'top', 'bottom'];

    const p = String(position ?? '')
      .toLowerCase()
      .trim() as PositionKey;
    if (p === 'right' || p === 'left' || p === 'top' || p === 'bottom') {
      return [p, ...all.filter((x) => x !== p)];
    }
    return ['right', 'left', 'top', 'bottom'];
  }

  private measureLabel(lines: string[], fontSize: number, charW: number) {
    const maxLen = Math.max(...lines.map((s) => s?.length ?? 0), 0);
    const w = Math.max(1, maxLen * charW);
    const h = Math.max(1, fontSize + (lines.length - 1) * fontSize * 1.1);
    return { w, h };
  }

  private rectFromTextAnchor(x: number, yBaseline: number, w: number, h: number, fontSize: number): Rect {
    const t = yBaseline - fontSize;
    return { l: x, t, r: x + w, b: t + h };
  }

  private buildCandidates(
    starX: number,
    starY: number,
    rStar: number,
    box: { w: number; h: number },
    fontSize: number,
    offsetPx: number,
    order: PositionKey[]
  ) {
    const gap = Math.max(0, offsetPx);

    const rightX = starX + rStar + gap;
    const rightY = starY - rStar - gap;
    const rightRect = this.rectFromTextAnchor(rightX, rightY, box.w, box.h, fontSize);

    const leftX = starX - rStar - gap - box.w;
    const leftY = rightY;
    const leftRect = this.rectFromTextAnchor(leftX, leftY, box.w, box.h, fontSize);

    const topX = starX - box.w / 2;
    const topY = starY - rStar - gap;
    const topRect = this.rectFromTextAnchor(topX, topY, box.w, box.h, fontSize);

    const bottomX = starX - box.w / 2;
    const bottomY = starY + rStar + gap + fontSize;
    const bottomRect = this.rectFromTextAnchor(bottomX, bottomY, box.w, box.h, fontSize);

    const dict: Record<PositionKey, { key: PositionKey; x: number; y: number; rect: Rect }> = {
      right: { key: 'right', x: rightX, y: rightY, rect: rightRect },
      left: { key: 'left', x: leftX, y: leftY, rect: leftRect },
      top: { key: 'top', x: topX, y: topY, rect: topRect },
      bottom: { key: 'bottom', x: bottomX, y: bottomY, rect: bottomRect },
    };

    return order.map((k) => dict[k]);
  }

  private contains(outer: Rect, inner: Rect): boolean {
    return inner.l >= outer.l && inner.t >= outer.t && inner.r <= outer.r && inner.b <= outer.b;
  }

  private intersects(a: Rect, b: Rect): boolean {
    return !(a.r <= b.l || a.l >= b.r || a.b <= b.t || a.t >= b.b);
  }

  private inflate(r: Rect, pad: number): Rect {
    if (!pad) return r;
    return { l: r.l - pad, t: r.t - pad, r: r.r + pad, b: r.b + pad };
  }
}
