import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ConstellationPanelsLayerComponent } from './main-panel/main-panel.component';

@Component({
  selector: 'g[app-panels-constalation]',
  standalone: true,
  imports: [CommonModule, ConstellationPanelsLayerComponent],
  templateUrl: './panels-constalation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelsConstellationComponent {}
