import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { Interface } from 'readline';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';

type Shape = 'circle' | 'cross' | 'square' | 'icon';

@Component({
  selector: 'app-stars-symbol-controls',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
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

  changeSize(size: string) {
    this.state.updateStarsSymbols({ size: Number(size) });
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
