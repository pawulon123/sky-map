import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';

@Component({
  selector: 'app-stars-label-controls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stars-label-controls.component.html',
  styleUrls: ['./stars-label-controls.component.css'],
})
export class StarsLabelControlsComponent {
  private state = inject(SkyMapStateService);

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

  // changePosition(position: 'top' | 'bottom' | 'left' | 'right') {
  //   this.state.updateStarsLabels({ position });
  // }

  updateLabelFontSize(fontSize: number) {
    this.state.updateStarsLabels({ fontSize });
  }

  // changeMaxLines(lines: number) {
  //   this.state.updateStarsLabels({ maxLines: lines });
  // }

  // toggleIcon(enabled: boolean) {
  //   this.state.updateStarsLabels({ iconEnabled: enabled });
  // }

  // toggleBorder(enabled: boolean) {
  //   this.state.updateStarsLabels({ borderEnabled: enabled });
  // }

  // changeBorderColor(color: string) {
  //   this.state.updateStarsLabels({ borderColor: color });
  // }

  // changeTextColor(color: string) {
  //   this.state.updateStarsLabels({ textColor: color });
  // }

  // changeBackgroundColor(color: string) {
  //   this.state.updateStarsLabels({ backgroundColor: color });
  // }
}
