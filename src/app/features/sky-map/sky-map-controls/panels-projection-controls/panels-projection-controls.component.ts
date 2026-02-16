import { Component, inject } from '@angular/core';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { ProjectionService } from '../../domain/services/projection/projection.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-panels-projection-controls',
  imports: [MatFormFieldModule, CommonModule, FormsModule, MatInputModule],
  templateUrl: './panels-projection-controls.component.html',
  styleUrl: './panels-projection-controls.component.css',
})
export class PanelsProjectionControlsComponent {
  private projectionSv = inject(ProjectionService);
  settings = this.projectionSv.settings();
  // pxToMm = PX_TO_MM

  updatePanelSize(key: string, value: number) {
    const size = this.projectionSv.settings().panelSize;
    this.projectionSv.setSettings({ panelSize: { ...size, [key]: value } });
  }
  update(key: string, value: number) {
    this.projectionSv.setSettings({ [key]: value });
  }
}
