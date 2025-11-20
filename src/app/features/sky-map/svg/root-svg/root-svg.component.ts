import { Component,  ElementRef, inject, Input, ViewChild } from '@angular/core';
import { StarsLayerComponent } from '../layers/stars-layer/stars-layer.component';
import { AsterismsLayerComponent } from '../layers/asterisms-layer/asterisms-layer.component';
import { BoundariesLayerComponent } from '../layers/boundaries-layer/boundaries-layer.component';
import { ConstellationLinesLayerComponent } from '../layers/constellation-lines-layer/constellation-lines-layer.component';
import { CommonModule } from '@angular/common';
import { SkyMapStateService } from '../../domain/services/sky-map-state/sky-map-state.service';
import { tap } from 'rxjs/operators';
import { ProjectionSettings } from '../../domain/models/projection-options.model';

@Component({
  selector: 'app-root-svg',
  imports: [
    CommonModule,
    StarsLayerComponent,
    AsterismsLayerComponent,
    BoundariesLayerComponent,
    ConstellationLinesLayerComponent /*, GridLayerComponent*/,
  ],
  templateUrl: './root-svg.component.html',
  styleUrl: './root-svg.component.css',
})
export class RootSvgComponent {
  readonly state = inject(SkyMapStateService);
  readonly projectionSettings$ = this.state.projectionSettings$.pipe(tap(this.setSize.bind(this)));
  readonly asterismSettings$ = this.state.asterismLayerSettings$;

  @Input() showGrid = true;
  @Input() showStars = true;
  @Input() showBoundaries = true;
  @Input() showConstellationLines = true;
  @Input() showLabels = true;
  @Input() maxIntensity: number | null = null;

  @ViewChild('skySvg', { static: false })
  skySvgRef!: ElementRef<SVGSVGElement>;

  width = 0;
  height = 0;
  setSize({ height, width }: ProjectionSettings) {
    this.height = height;
    this.width = width;
  }

  exportSvgForEngraving() {
    const svgEl = this.skySvgRef?.nativeElement;
    if (!svgEl) return;

    // sklonuj SVG, żeby nie grzebać w żywym DOM
    const clone = svgEl.cloneNode(true) as SVGSVGElement;

    // upewniamy się, że są sensowne atrybuty (dla programów od grawerki)
    clone.removeAttribute('ng-reflect-ng-if'); // jakby coś leciało z Angulara
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    // opcjonalnie: ustaw rozmiar w mm (wiele grawerek lubi mm)
    // np. 1px = 0.264583 mm (96 dpi), możesz dopasować do swojego workflow
    const mmWidth = this.width * 0.264583;
    const mmHeight = this.height * 0.264583;
    clone.setAttribute('width', `${mmWidth}mm`);
    clone.setAttribute('height', `${mmHeight}mm`);

    // serializacja do stringa
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(clone);

    // nagłówek XML (część programów tego wymaga)
    if (!source.startsWith('<?xml')) {
      source = '<?xml version="1.0" encoding="UTF-8"?>\n' + source;
    }

    // utwórz Blob i ściągnij plik
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'skymap-engraving.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }
}
