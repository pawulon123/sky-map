import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RootSvgComponent } from './svg/root-svg/root-svg.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RootSvgComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  width = signal(1200);
  height = signal(1200);
  projectionName = signal<'stereographic'|'azimuthal'|'azimuthalEA'|'orthographic'|'gnomonic'|'mercator'|'equirect'>('stereographic');

  showStars = signal(true);
  showBoundaries = signal(true);
  showGrid = signal(true);
  showAsterisms = signal(true);
  showConstellationLines = signal(true);
  showLabels = signal(false);
  maxMag = signal<number | null>(2.5);

  setProjection(name: any) { this.projectionName.set(name); }
  setSize(w: number, h: number) { this.width.set(w); this.height.set(h); }
}
