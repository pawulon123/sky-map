import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarsSymbolControlsComponent } from '../stars-symbol-controls/stars-symbol-controls.component';
import { StarsLabelControlsComponent } from '../stars-label-controls/stars-label-controls.component';

@Component({
  selector: 'app-sky-map-layer-stars-controls',
  standalone: true,
  imports: [CommonModule, StarsSymbolControlsComponent, StarsLabelControlsComponent],
  templateUrl: './sky-map-layer-stars-controls.component.html',
  styleUrls: ['./sky-map-layer-stars-controls.component.css'],
})
export class SkyMapLayerStarsControlsComponent {}
