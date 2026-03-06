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
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { FontLabelComponent } from '../../components/font-label/font-label.component';
import { ColisionLabelComponent } from '../colision-label/colision-label.component';
import { HeaderPortalComponent } from '../../header-portal.component';
import { MatDividerModule } from '@angular/material/divider';
import { tap } from 'rxjs';
import { FontSVG } from '../../../domain/models/font';

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
    FontLabelComponent,
    ColisionLabelComponent,
    HeaderPortalComponent,
    MatCheckboxModule,
    MatDividerModule,
  ],
  templateUrl: './stars-label-controls.component.html',
  styleUrls: ['./stars-label-controls.component.css'],
})
export class StarsLabelControlsComponent {
  private state = inject(SkyMapStateService);
  starsSettings$ = this.state.starsLayerSettings$;

  updateFont(font: FontSVG) {
    this.state.updateStarsLabels(font);
  }
  updateColision(Colision: StarsLabelsSettings) {
    this.state.updateStarsLabels(Colision);
  }

  updateMagnitudeRange(index: 0 | 1, value: number, range: [number, number]) {
    const magnitudeRange = this.getValidateRange(index, range, Number(value));
    this.update('magnitudeRange', magnitudeRange);
  }

  private getValidateRange(index: 0 | 1, [min, max]: [number, number], value: number): [number, number] {
    const isMin = index === 0;
    const newMin = isMin ? value : value < min ? value : min;
    const newMax = isMin ? (value > max ? value : max) : value;
    return [newMin, newMax];
  }

  update(prop: keyof StarsLabelsSettings, value: any) {
    this.state.updateStarsLabels({ [prop]: value });
  }
}
