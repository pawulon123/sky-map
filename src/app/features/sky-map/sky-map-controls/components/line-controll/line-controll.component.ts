import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { LineSVGControll } from '../../../domain/models/line-svg-controll';
import { FormsModule } from '@angular/forms';
import { ColorInputComponent } from '../color-input/color-input.component';
import { OpacityInputComponent } from '../opacity-input/opacity-input.component';

@Component({
  selector: 'app-line-controll',
  imports: [
    MatRadioModule,
    MatFormFieldModule,
    MatSliderModule,
    FormsModule,
    ColorInputComponent,
    OpacityInputComponent,
  ],
  templateUrl: './line-controll.component.html',
  styleUrl: './line-controll.component.css',
})
export class LineControllComponent {
  @Input() settings!: LineSVGControll;
  @Output() updateLine = new EventEmitter();

  update(prop: keyof LineSVGControll, value: any) {
    this.updateLine.emit({ [prop]: value });
  }
}
