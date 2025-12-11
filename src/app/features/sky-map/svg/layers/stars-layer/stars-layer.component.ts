import { Component, computed, inject, Input, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Star } from '../../../domain/models/star.model';
import { StarsService } from '../../../domain/services/stars/stars.service';
import { LabelsLayerComponent } from '../labels-layer/labels-layer.component';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { StarsLayerSettings, StarsSymbolsSettings } from '../../../domain/models/stars-layer-settings.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { symbol } from 'd3';
import { defaultStarsSettings } from '../../../domain/default/stars';

@Component({
  selector: 'g[app-stars-layer]',
  standalone: true,
  imports: [CommonModule, LabelsLayerComponent],
  templateUrl: './stars-layer.component.html',
  styleUrl: './stars-layer.component.css',
})
export class StarsLayerComponent {
  private svc = inject(StarsService);
  private state = inject(SkyMapStateService);

  starsSettings$ = this.state.starsLayerSettings$;

  maxMag = input<number | null>(null);
  showLabels = input<boolean>(true);

  private readonly starsSettings = toSignal(this.state.starsLayerSettings$, {
    initialValue: {
      symbols: {
        shape: defaultStarsSettings.symbols.shape,
        size: defaultStarsSettings.symbols.size,
      },
    } as StarsLayerSettings,
  });

  stars = computed<Star[]>(() => {
    const all = this.svc.data().stars ?? [];
    let visible = all.filter((s) => Array.isArray(s.__projected));

    let attachProp: any[] = [];

    const limit = this.maxMag();
    if (limit != null) {
      visible = visible.filter((s) => s.mag == null || s.mag <= limit);

      const settings = this.starsSettings();
      const commonForShapes = Object.fromEntries(
        Object.entries(this.commonForShapes).map(([k, v]) => [k, v(settings.symbols)])
      );

      const shape = settings.symbols.shape;

      attachProp = visible.map((s: Star) => {
        // const fns = this.shapes[shape]

        const forShape = Object.fromEntries(
          Object.entries(this.shapes[shape]).map(([k, v]) => [k, v(s, settings.symbols)])
        );
        const withStar = Object.fromEntries(Object.entries(this.commonWidthStar).map(([k, v]) => [k, v(s)]));

        return Object.assign({}, forShape, commonForShapes, withStar);
      });
    }

    return [...attachProp].sort((a, b) => (a.mag ?? 99) - (b.mag ?? 99));
  });
  commonWidthStar = {
    starCy: this.starCy.bind(this),
    starCx: this.starCx.bind(this),
  };
  commonForShapes = {
    fillOpacity: this.fillOpacity.bind(this),
    strokeColor: this.strokeColor.bind(this),
    strokeOpacity: this.strokeOpacity.bind(this),
  };
  shapes = {
    circle: {
      scaledRadius: this.scaledRadius.bind(this),
      baseStrokeWidth: this.baseStrokeWidth.bind(this),
    },
    ring: {
      scaledRadius: this.scaledRadius.bind(this),
      ringStrokeWidth: this.ringStrokeWidth.bind(this),
    },
    star: {
      starPoints: this.starPoints.bind(this),
      baseStrokeWidth: this.baseStrokeWidth.bind(this),
    },
    cross: {
      scaledRadius: this.scaledRadius.bind(this),
      crossStrokeWidth: this.crossStrokeWidth.bind(this),
    },
    square: {
      squarePoints: this.squarePoints.bind(this),
      baseStrokeWidth: this.baseStrokeWidth.bind(this),
    },
    triangle: {
      trianglePoints: this.trianglePoints.bind(this),
      baseStrokeWidth: this.baseStrokeWidth.bind(this),
    },
    custom: {
      customSvgTransform: this.customSvgTransform.bind(this),
      baseStrokeWidth: this.baseStrokeWidth.bind(this),
    },
  };

  radius(s: Star, rMin = 0.2, rMax = 2.8): number {
    const mag = s.mag;
    const clamped = Math.max(-1.5, Math.min(8, mag ?? 6));
    const t = (8 - (clamped + 1.5)) / 9.5;
    return rMin + t * (rMax - rMin);
  }

  scaledRadius(s: Star, symbols: Partial<StarsSymbolsSettings>): number {
    const size = symbols.size ?? 1;
    return this.radius(s) * size;
  }

  starCx(s: Star): number {
    const p = s.__projected ?? [0, 0];
    return p[0];
  }

  starCy(s: Star): number {
    const p = s.__projected ?? [0, 0];
    return p[1];
  }

  // --- styl wspólny ---

  strokeColor(symbols: StarsSymbolsSettings): string {
    return symbols.strokeColor ?? symbols.color;
  }

  fillOpacity(symbols: StarsSymbolsSettings): number {
    return symbols.fillOpacity ?? 1;
  }

  strokeOpacity(symbols: StarsSymbolsSettings): number {
    return symbols.strokeOpacity ?? 1;
  }

  baseStrokeWidth(s: Star, symbols: StarsSymbolsSettings): number {
    const base = this.radius(s) * 0.25;
    const factor = symbols.strokeWidth ?? 1;
    return base * factor;
  }

  ringStrokeWidth(s: Star, symbols: StarsSymbolsSettings): number {
    const base = this.radius(s);
    const factor = symbols.strokeWidth ?? 0.4;
    return base * factor;
  }

  crossStrokeWidth(s: Star, symbols: StarsSymbolsSettings): number {
    const base = this.radius(s) * 0.3;
    const factor = symbols.strokeWidth ?? 1;
    return base * factor;
  }

  // --- geometra kształtów ---

  trianglePoints(s: Star, symbols: StarsSymbolsSettings): string {
    const r = this.scaledRadius(s, symbols);
    return `0,${-r} ${-r},${r} ${r},${r}`;
  }

  squarePoints(s: Star, symbols: StarsSymbolsSettings): string {
    const r = this.scaledRadius(s, symbols);
    return `${-r},${-r} ${-r},${r} ${r},${r} ${r},${-r}`;
  }

  starPoints(s: Star, symbols: StarsSymbolsSettings): string {
    const outer = this.scaledRadius(s, symbols);
    const inner = outer * 0.4;
    const points: string[] = [];

    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI / 5) * i - Math.PI / 2;
      const r = i % 2 === 0 ? outer : inner;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      points.push(`${x},${y}`);
    }

    return points.join(' ');
  }

  customSvgTransform(s: Star, symbols: StarsSymbolsSettings): string {
    const size = symbols.size ?? 1;
    const r = this.radius(s) * size;
    const scale = r;
    return `translate(${-0.5 * scale},${-0.5 * scale}) scale(${scale})`;
  }

  getProp() {
    const shape = {
      star: {
        starPoints: this.starPoints.bind(this),
        baseStrokeWidth: this.baseStrokeWidth.bind(this),
      },
    };
  }
}
