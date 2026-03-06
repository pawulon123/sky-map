import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { fontFamily } from '../../../domain/default/stars';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FontSVG } from '../../../domain/models/font';
import { ColorInputComponent } from '../color-input/color-input.component';
import { OpacityInputComponent } from '../opacity-input/opacity-input.component';

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
    ColorInputComponent,
    OpacityInputComponent,
  ],
  templateUrl: './font-label.component.html',
  styleUrl: './font-label.component.css',
})
export class FontLabelComponent {
  @Input() settingsLabels!: FontSVG;
  @Output() updateFont = new EventEmitter();
  fonts = fontFamily;

  update(prop: keyof FontSVG, value: any) {
    this.updateFont.emit({ [prop]: value });
  }
}
