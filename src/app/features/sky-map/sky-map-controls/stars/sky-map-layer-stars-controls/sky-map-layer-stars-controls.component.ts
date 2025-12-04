import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarsSymbolControlsComponent } from '../stars-symbol-controls/stars-symbol-controls.component';
import { StarsLabelControlsComponent } from '../stars-label-controls/stars-label-controls.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatTabGroup, MatTab } from '@angular/material/tabs';

@Component({
  selector: 'app-sky-map-layer-stars-controls',
  standalone: true,
  imports: [CommonModule, MatTabGroup, StarsSymbolControlsComponent, StarsLabelControlsComponent, MatTab],
  templateUrl: './sky-map-layer-stars-controls.component.html',
  styleUrls: ['./sky-map-layer-stars-controls.component.css'],
})
export class SkyMapLayerStarsControlsComponent {}
