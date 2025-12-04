import { Component, inject } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { BoundaryLabels } from '../../../domain/models/boundary.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lines-boundaries-controlls',
  imports: [CommonModule, MatSlideToggleModule],
  templateUrl: './lines-boundaries-controlls.component.html',
  styleUrl: './lines-boundaries-controlls.component.css',
})
export class LinesBoundariesControllsComponent {
  private state = inject(SkyMapStateService);

  boundariesSettings$ = this.state.boundariesLayerSettings$;
  update(key: keyof BoundaryLabels, value: any) {
    this.state.updateBoundaryLines({ [key]: value });
  }
}
