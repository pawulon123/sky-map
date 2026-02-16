import { Component, inject } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatOption, MatSelectModule } from '@angular/material/select';
import { ProjectionService } from '../../domain/services/projection/projection.service';
import { ProjectionName } from '../../domain/models/projection-options.model';
import { projections } from '../../domain/default/projection';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-map-projection-controls',
  imports: [
    CommonModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDividerModule,
  ],
  templateUrl: './map-projection-controls.component.html',
  styleUrl: './map-projection-controls.component.css',
})
export class MapProjectionControlsComponent {
  projections = projections;
  protected projectionSv = inject(ProjectionService);
  width() {
    return this.projectionSv.settings().width;
  }
  height() {
    return this.projectionSv.settings().height;
  }
  setSize(width: number, height: number) {
    this.projectionSv.setSettings({ width, height });
  }

  setProjection(projectionName: ProjectionName) {
    this.projectionSv.setSettings({ projectionName });
  }

  toggleMirrorX(mirrorX: boolean) {
    this.projectionSv.setSettings({ mirrorX });
  }
}
