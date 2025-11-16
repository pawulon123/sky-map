import { Component, inject, OnInit } from '@angular/core';
import { SkyMapControlsComponent } from '../sky-map-controls/sky-map-controls.component';
import { SkyMapSvgComponent } from '../sky-map-svg/sky-map-svg.component';
import { RefreshProjectionService } from '../domain/services/projection/refresh-projection.service';

@Component({
  selector: 'app-sky-map-page',
  imports: [SkyMapSvgComponent, SkyMapControlsComponent],
  templateUrl: './sky-map-page.component.html',
  styleUrl: './sky-map-page.component.css',
})
export class SkyMapPageComponent {}
