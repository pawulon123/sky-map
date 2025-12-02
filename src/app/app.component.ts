import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkyMapPageComponent } from './features/sky-map/sky-map-page/sky-map-page.component';
import { SvgData } from './core/common/svg-data';
import { exportSvg } from './core/utils/export-svg';
import { svgDataDefault } from './core/default/svg-data';
import { log } from 'node:util';
import { SvgTooltipComponent } from './core/tooltip/tooltip.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SkyMapPageComponent, SvgTooltipComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  svgData: SvgData = svgDataDefault;
  setSvgData(svgData: SvgData) {
    this.svgData = svgData;
  }

  exportSvg() {
    exportSvg(this.svgData);
  }
}
