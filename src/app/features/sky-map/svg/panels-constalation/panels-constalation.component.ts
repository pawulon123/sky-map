import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ConstellationPanelsLayerComponent } from './main-panel/main-panel.component';
import { SkyMapStateService } from '../../domain/services/sky-map-state/sky-map-state.service';
import { ConstellationPanelsLayoutService } from './constellation-panels-layout.service';

@Component({
  selector: 'g[app-panels-constalation]',
  standalone: true,
  imports: [CommonModule, ConstellationPanelsLayerComponent],
  templateUrl: './panels-constalation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelsConstellationComponent {}
