import { Component, computed, inject, Input } from '@angular/core';
import { StarsLayerComponent } from "../layers/stars-layer/stars-layer.component";
import { AsterismsLayerComponent } from "../layers/asterisms-layer/asterisms-layer.component";
import { BoundariesLayerComponent } from "../layers/boundaries-layer/boundaries-layer.component";
import { ConstellationLinesLayerComponent } from "../layers/constellation-lines-layer/constellation-lines-layer.component";
import { GridLayerComponent } from "../layers/grid-layer/grid-layer.component";
import { LabelsLayerComponent } from "../layers/labels-layer/labels-layer.component";
import { CommonModule } from '@angular/common';
import { ProjectionService } from '../../domain/services/projection/projection.service';



@Component({
  selector: 'app-root-svg',
  imports: [CommonModule, StarsLayerComponent, AsterismsLayerComponent, BoundariesLayerComponent, ConstellationLinesLayerComponent/*, GridLayerComponent*/ ],
  templateUrl: './root-svg.component.html',
  styleUrl: './root-svg.component.css'
})
export class RootSvgComponent {

  
  private proj = inject(ProjectionService);

  // Rozmiar <svg> nadal kontrolujemy przez @Input,
  // ale ProjectionService i tak ma własne wymiary do liczenia projekcji.
  // To jest ok. Daje nam elastyczność.
  @Input() width  = 1200;
  @Input() height = 1200;

  // Widoczność warstw / opcje UI
  @Input() showGrid = true;
  @Input() showStars = true;
  @Input() showBoundaries = true;
  @Input() showAsterisms = true;
  @Input() showConstellationLines = true;
  @Input() showLabels = true;

  // maxIntensity = maxMag (limit jasności)
  @Input() maxIntensity: number | null = null;

  // Ścieżki sfery i siatki z ProjectionService (reagują na rzut!)
  spherePath = computed(() => this.proj.spherePath());
  graticulePath = computed(() => this.proj.graticulePath());

}
