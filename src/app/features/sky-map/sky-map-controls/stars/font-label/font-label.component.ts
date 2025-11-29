import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { defaultStarsSettings, fontForLabelStars } from '../../../domain/default/stars';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StarsLabelsSettings } from '../../../domain/models/stars-layer-settings.model';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-font-label',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatOptionModule,
    MatSlideToggleModule,
    MatSliderModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './font-label.component.html',
  styleUrl: './font-label.component.css',
})
export class FontLabelComponent {
  @Input() settingsLabels = defaultStarsSettings.labels;
  @Output() updateFont = new EventEmitter();
  fonts = fontForLabelStars;

  update(prop: keyof StarsLabelsSettings, value: any) {
    this.updateFont.emit({ [prop]: value });
  }
}
