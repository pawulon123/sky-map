import { computed, inject, Injectable, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { defaultStarsSettings } from '../../../domain/default/stars';
import { StarsService } from '../../../domain/services/stars/stars.service';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { Star } from '../../../domain/models/star.model';
import { RenderStar } from '../../../domain/models/stars-layer-settings.model';

@Injectable({
  providedIn: 'root',
})
export class StarSymbolService {
  private svc = inject(StarsService);
  private state = inject(SkyMapStateService);

  private readonly settingsSig = toSignal(this.state.starsLayerSettings$, {
    initialValue: defaultStarsSettings,
  });
  private readonly visibleStars = computed<Star[]>(() => {
    const all = this.svc.data().stars ?? [];

    const symbolSettings = this.settingsSig().symbols;
    let visible = all.filter((s) => Array.isArray(s.__projected));
    const filteredMag = visible.filter(({ mag }) => symbolSettings.magMax >= mag);

    const selectedConstelation = this.state.getProjectionSettings().selected;

    const finelyStars = filteredMag.filter(({ con }) => selectedConstelation?.includes(con));

    return [...finelyStars].sort((a, b) => (a.mag ?? 99) - (b.mag ?? 99));
  });

  readonly starSynbols = computed<RenderStar[]>(() => {
    const settings = this.settingsSig();
    const sym = settings.symbols;

    return this.visibleStars().map((star) => {
      const [cx, cy] = star.__projected ?? [0, 0];
      const mag = star.mag ?? null;

      const rBase = this.radius(star);
      const r = rBase * (sym.size ?? 1);

      const baseStrokeWidth = rBase * 0.25 * (sym.strokeWidth ?? 1);
      const ringStrokeWidth = rBase * (sym.strokeWidth ?? 0.4);
      const crossStrokeWidth = rBase * 0.3 * (sym.strokeWidth ?? 1);

      const fillOpacity = sym.fillOpacity ?? 1;
      const strokeOpacity = sym.strokeOpacity ?? 1;
      const strokeColor = sym.strokeColor ?? sym.color;
      const fillColor = sym.shape === 'ring' ? 'none' : sym.color;
      const hasFill = !!sym.fillOpacity;
      const { polygonPoints, customTransform } = this.getPropForShape(sym.shape, r);

      return {
        star,
        cx,
        cy,
        mag,
        shape: sym.shape,

        r,
        ringStrokeWidth,
        baseStrokeWidth,
        crossStrokeWidth,
        polygonPoints,
        customTransform,

        fillColor,
        fillOpacity,
        strokeColor,
        strokeOpacity,
        hasFill,
      };
    });
  });

  private getPropForShape(shape: string, r: number): { polygonPoints: string; customTransform: string } {
    const propForShape = { polygonPoints: '', customTransform: '' };
    switch (shape) {
      case 'star': {
        propForShape.polygonPoints = this.starPoints(r);
        break;
      }
      case 'square': {
        propForShape.polygonPoints = this.squarePoints(r);
        break;
      }
      case 'triangle': {
        propForShape.polygonPoints = this.trianglePoints(r);
        break;
      }
      case 'custom': {
        const scale = r;
        propForShape.customTransform = `translate(${-0.5 * scale},${-0.5 * scale}) scale(${scale})`;
        break;
      }
      default:
        break;
    }
    return propForShape;
  }

  private radius(s: Star, rMin = 0.2, rMax = 2.8): number {
    const mag = s.mag;
    const clamped = Math.max(-1.5, Math.min(8, mag ?? 6));
    const t = (8 - (clamped + 1.5)) / 9.5;
    return rMin + t * (rMax - rMin);
  }

  private starPoints(r: number): string {
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
  private squarePoints(r: number): string {
    return `${-r},${-r} ${-r},${r} ${r},${r} ${r},${-r}`;
  }

  private trianglePoints(r: number): string {
    return `0,${-r} ${-r},${r} ${r},${r}`;
  }
}
