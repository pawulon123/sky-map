import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-opacity-input',
  imports: [MatSliderModule, FormsModule],
  templateUrl: './opacity-input.component.html',
  styleUrl: './opacity-input.component.css',
})
export class OpacityInputComponent {
  @Output() valueChange = new EventEmitter<string>();
  @Input() value = 1;
  @Input() disabled = false;

  onOpacityChange(opacity: string) {
    this.valueChange.emit(opacity);
  }
}
