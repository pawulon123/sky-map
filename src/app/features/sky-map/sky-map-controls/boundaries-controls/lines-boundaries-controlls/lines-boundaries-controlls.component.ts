import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { map } from 'rxjs';

// Angular Material
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BoundaryLayerSettings } from '../../../domain/models/boundary.model';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';

type BoundaryLinesSettings = BoundaryLayerSettings['lines'];

@Component({
  selector: 'app-boundary-lines-controls',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, MatRadioModule, MatSliderModule, MatFormFieldModule, MatInputModule],
  templateUrl: './lines-boundaries-controlls.component.html',
  styleUrl: './lines-boundaries-controlls.component.css',
})
export class BoundaryLinesControlsComponent {
  private state = inject(SkyMapStateService);

  boundaryLinesSettings$ = this.state.boundariesLayerSettings$.pipe(map((s) => s.lines));

  update<K extends keyof BoundaryLinesSettings>(key: K, value: BoundaryLinesSettings[K]) {
    this.state.updateBoundaryLines({ [key]: value } as Partial<BoundaryLinesSettings>);
  }
}
