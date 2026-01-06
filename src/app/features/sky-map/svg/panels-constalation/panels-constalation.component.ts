import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ConstellationPanelsLayerComponent } from './main-panel/main-panel.component';
import { SkyMapStateService } from '../../domain/services/sky-map-state/sky-map-state.service';
import { ConstellationPanelsLayoutService } from './constellation-panels-layout.service';

@Component({
  selector: 'app-panels-constalation',
  standalone: true,
  imports: [CommonModule, ConstellationPanelsLayerComponent],
  templateUrl: './panels-constalation.component.html',
})
export class PanelsConstellationComponent implements AfterViewInit {
  layout = inject(ConstellationPanelsLayoutService).layout;
  readonly state = inject(SkyMapStateService);
  @ViewChild('skySvg', { static: false }) svgRef!: ElementRef<SVGSVGElement>;
  ngAfterViewInit(): void {
    this.state.setRefSvg(this.svgRef);
  }
}
