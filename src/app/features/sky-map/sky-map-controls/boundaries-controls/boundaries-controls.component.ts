import { Component, inject } from '@angular/core';
import { SkyMapStateService } from '../../domain/services/sky-map-state/sky-map-state.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-boundaries-controls',
  imports: [CommonModule, FormsModule],
  templateUrl: './boundaries-controls.component.html',
  styleUrl: './boundaries-controls.component.css',
})
export class BoundariesControlsComponent {
  private state = inject(SkyMapStateService);

  boundariesSettings$ = this.state.boundariesLayerSettings$;

  toggleVisible(visible: boolean) {
    this.state.updateBoundary({ visible });
  }
}
