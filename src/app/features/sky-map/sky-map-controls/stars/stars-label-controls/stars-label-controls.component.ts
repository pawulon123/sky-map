import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { StarsLabelsSettings } from '../../../domain/models/stars-layer-settings.model';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { fontForLabelStars } from '../../../domain/default/stars';
import { MatCheckbox } from '@angular/material/checkbox';
type CollisionKey = 'boundaries' | 'star-symbol' | string;

interface CollisionOption {
  key: CollisionKey; // np. "boundaries", "star-symbol"
  label: string; // tekst w UI
  checked: boolean;
}
@Component({
  selector: 'app-stars-label-controls',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatOptionModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatCheckbox,
  ],
  templateUrl: './stars-label-controls.component.html',
  styleUrls: ['./stars-label-controls.component.css'],
})
export class StarsLabelControlsComponent {
  collisionsMain = true;

  collisionOptions: CollisionOption[] = [
    { key: 'boundaries', label: 'Granice konstelacji (boundaries)', checked: false },
    { key: 'star-symbol', label: 'Symbole gwiazd (star-symbol)', checked: false },
  ];

  // UWAGA: teraz może być array albo null
  collisionTargets: string[] | null = null;

  onCollisionsMainChange(checked: boolean): void {
    this.collisionsMain = checked;

    if (!checked) {
      // wyłączenie -> odznaczyć podrzędne
      this.collisionOptions = this.collisionOptions.map((opt) => ({
        ...opt,
        checked: false,
      }));
    }

    this.updateCollisionTargets();
  }

  onChildCollisionChange(key: CollisionKey, checked: boolean): void {
    if (!this.collisionsMain) return;

    this.collisionOptions = this.collisionOptions.map((opt) => (opt.key === key ? { ...opt, checked } : opt));

    this.updateCollisionTargets();
  }

  private updateCollisionTargets(): void {
    this.collisionTargets = !this.collisionsMain
      ? null
      : this.collisionOptions.filter((opt) => opt.checked).map((opt) => opt.key);

    this.update('colision', this.collisionTargets);
  }

  private state = inject(SkyMapStateService);
  fonts = fontForLabelStars;

  starsSettings$ = this.state.starsLayerSettings$;

  toggleLabelsVisible(visible: boolean) {
    this.state.updateStarsLabels({ visible });
  }

  toggleBayerVisible(showBayer: boolean) {
    this.state.updateStarsLabels({ showBayer });
  }

  updateMagnitudeRange(index: 0 | 1, value: number, range: [number, number]) {
    const magnitudeRange = this.getValidateRange(index, range, Number(value));
    this.state.updateStarsLabels({ magnitudeRange });
  }

  private getValidateRange(index: 0 | 1, [min, max]: [number, number], value: number): [number, number] {
    const isMin = index === 0;
    const newMin = isMin ? value : value < min ? value : min;
    const newMax = isMin ? (value > max ? value : max) : value;
    return [newMin, newMax];
  }

  updateLabelFontSize(fontSize: number) {
    this.state.updateStarsLabels({ fontSize });
  }

  update(prop: keyof StarsLabelsSettings, value: any) {
    this.state.updateStarsLabels({
      [prop]: value,
    });
  }
}
