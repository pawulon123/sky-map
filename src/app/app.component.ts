import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RootSvgComponent } from './svg/root-svg/root-svg.component';
import { ProjectionService } from './services/projection.service';
import { StarsService } from './services/stars.service';
import { SkyMapPageComponent } from './features/sky-map/sky-map-page/sky-map-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SkyMapPageComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  // private proj = inject(ProjectionService);
  // private starsSvc = inject(StarsService);
  // // UI toggles
  // showStars = true;
  // showBoundaries = true;
  // showGrid = true;
  // showAsterisms = true;
  // showConstellationLines = true;
  // showLabels = true;
  // maxMag: number | null = 6.5;
  // // start values
  // private startWidth  = 1200;
  // private startHeight = 1200;
  // private startProj: 'stereographic'|'azimuthal'|'azimuthalEA'|'orthographic'|'gnomonic'|'mercator'|'equirect'
  //   = 'stereographic';
  // constructor() {
  //   // 1. Ustaw projekcję i rozmiar w ProjectionService
  //   this.proj.setSize(this.startWidth, this.startHeight);
  //   this.proj.setName(this.startProj);
  //   // 2. Załaduj gwiazdy i zrób pierwszą reprojekcję
  //   (async () => {
  //     await this.starsSvc.loadOnce();
  //     this.proj.reprojectStars(this.starsSvc);
  //   })();
  // }
  // // helpers dla template
  // width()  { return this.proj.width(); }
  // height() { return this.proj.height(); }
  // // UI action: zmiana projekcji (przyciski)
  // setProjection(name: any) {
  //   this.proj.setName(name);
  //   this.proj.reprojectStars(this.starsSvc);
  // }
  // // UI action: zmiana rozmiaru (inputy width/height)
  // setSize(w: number, h: number) {
  //   this.proj.setSize(w, h);
  //   this.proj.reprojectStars(this.starsSvc);
  // }
  // // --- WARSTWY ---
  // /** Czy wszystkie warstwy są aktualnie włączone */
  // allLayersOn(): boolean {
  //   return (
  //     this.showStars &&
  //     this.showBoundaries &&
  //     this.showGrid &&
  //     this.showAsterisms &&
  //     this.showConstellationLines &&
  //     this.showLabels
  //   );
  // }
  // /** Włącz/wyłącz wszystkie warstwy jednym checkboxem */
  // toggleAllLayers(checked: boolean) {
  //   this.showStars = checked;
  //   this.showBoundaries = checked;
  //   this.showGrid = checked;
  //   this.showAsterisms = checked;
  //   this.showConstellationLines = checked;
  //   this.showLabels = checked;
  // }
}
