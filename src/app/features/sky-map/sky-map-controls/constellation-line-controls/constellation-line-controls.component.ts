import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyMapStateService } from '../../domain/services/sky-map-state/sky-map-state.service';

@Component({
  selector: 'app-constellation-line-controls',
  imports: [CommonModule, FormsModule],
  templateUrl: './constellation-line-controls.component.html',
  styleUrl: './constellation-line-controls.component.css',
})
export class ConstellationLineControlsComponent {
  private state = inject(SkyMapStateService);
  constellationLineSettings$ = this.state.constellationLineSettings$;

  toggleVisible(visible: boolean) {
    this.state.updateConstellationLine({ visible });
  }
}
