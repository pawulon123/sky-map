import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyMapStateService } from '../../domain/services/sky-map-state/sky-map-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-asterism-controls',
  imports: [CommonModule, FormsModule],
  templateUrl: './asterism-controls.component.html',
  styleUrl: './asterism-controls.component.css',
})
export class AsterismControlsComponent {
  private state = inject(SkyMapStateService);

  asterismSettings$ = this.state.asterismLayerSettings$;

  toggleVisible(visible: boolean) {
    this.state.updateAsterism({ visible });
  }
}
