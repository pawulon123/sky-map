import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkyMapPageComponent } from './features/sky-map/sky-map-page/sky-map-page.component';
import { SvgData, SvgRef } from './core/common/svg-data';
import { svgDataDefault } from './core/default/svg-data';
import { SvgTooltipComponent } from './core/tooltip/tooltip.component';
import { CommonMenuComponent } from './common-menu/common-menu.component';
import { EventCommonMenu, ZoomMode } from './core/common/event-common-menu';
import { SvgDataService } from './core/services/svg-data-ref.service';
import { renderDefaultSettings } from './core/default/render-default';
import { PanService } from './core/services/pan.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SkyMapPageComponent, SvgTooltipComponent, CommonMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  eventFromCommonMenu = renderDefaultSettings;
  panService = inject(PanService);
  svgDataService = inject(SvgDataService);
  setSvgRef(svgRef: SvgRef) {
    this.svgDataService.setSvgRef(svgRef);
    // console.log(svgRef);
  }

  setDataFromSvg(svgData: SvgData) {
    //console.log(svgData);

    this.svgDataService.setSvgData(svgData);
  }

  dataFromSvg: SvgData = svgDataDefault;
}
