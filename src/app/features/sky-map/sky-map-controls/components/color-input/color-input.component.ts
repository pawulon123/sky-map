import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-color-input',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './color-input.component.html',
})
export class ColorInputComponent {
  @Input() label = 'Kolor';
  @Input() value = '#ffffff';
  @Input() disabled = false;
  @Input() showHex = false;

  @Output() valueChange = new EventEmitter<string>();

  onColorChange(color: string): void {
    if (!this.isValidColor(color)) return;
    this.value = color;
    this.valueChange.emit(color);
  }

  onTextChange(color: string): void {
    this.value = color;

    if (this.isValidColor(color)) {
      this.valueChange.emit(color);
    }
  }

  openNativePicker(input: HTMLInputElement): void {
    if (this.disabled) return;

    const picker = input as HTMLInputElement & {
      showPicker?: () => void;
    };

    if (typeof picker.showPicker === 'function') {
      picker.showPicker();
    } else {
      input.click();
    }
  }

  private isValidColor(value: string): boolean {
    return /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(value);
  }
}
