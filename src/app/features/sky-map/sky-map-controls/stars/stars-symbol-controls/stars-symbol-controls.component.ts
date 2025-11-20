import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { Interface } from 'readline';

type Shape = 'circle' | 'cross' | 'square' | 'icon';

@Component({
  selector: 'app-stars-symbol-controls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stars-symbol-controls.component.html',
  styleUrls: ['./stars-symbol-controls.component.css'],
})
export class StarsSymbolControlsComponent {
  private state = inject(SkyMapStateService);

  // Strumień z ustawieniami warstwy gwiazd (całość),
  // w template korzystamy tylko z części "symbols".
  starsSettings$ = this.state.starsLayerSettings$;

  toggleVisible(visible: boolean) {
    this.state.updateStarsSymbols({ visible });
  }

  updateRing(value: number) {
    this.state.updateStarsSymbols({ ring: Number(value) });
  }

  updateMagMax(value: number) {
    this.state.updateStarsSymbols({ magMax: Number(value) });
  }

  changeShape(shape: Shape) {
    this.state.updateStarsSymbols({ shape });
  }

  changeSize(size: number) {
    this.state.updateStarsSymbols({ size });
  }

  changeColor(color: string) {
    this.state.updateStarsSymbols({ color });
  }

  changeStrokeWidth(width: number) {
    this.state.updateStarsSymbols({ strokeWidth: width });
  }

  changeStrokeColor(color: string) {
    this.state.updateStarsSymbols({ strokeColor: color });
  }

  toggleScaleByMagnitude(enabled: boolean) {
    this.state.updateStarsSymbols({ scaleByMagnitude: enabled });
  }
}
