import { Component, inject } from '@angular/core';
import { ProjectionService } from '../../domain/services/projection/projection.service';
import { SkyMapStateService } from '../../domain/services/sky-map-state/sky-map-state.service';
import { ProjectionName } from '../../domain/models/projection-options.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { projections } from '../../domain/default/projection';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-projection-controls',
  imports: [CommonModule, FormsModule, MatFormField, MatLabel, MatSelect, MatOption, MatInputModule, MatCheckboxModule],
  templateUrl: './projection-controls.component.html',
  styleUrl: './projection-controls.component.css',
})
export class ProjectionControlsComponent {
  private state = inject(SkyMapStateService);
  starsSettings$ = this.state.starsLayerSettings$;
  projections = projections;
  protected projectionSv = inject(ProjectionService);

  setProjection(projectionName: ProjectionName) {
    this.projectionSv.setSettings({ projectionName });
  }

  setSize(width: number, height: number) {
    this.projectionSv.setSettings({ width, height });
  }

  width() {
    return this.projectionSv.settings().width;
  }
  height() {
    return this.projectionSv.settings().height;
  }

  toggleMirrorX(mirrorX: boolean) {
    this.projectionSv.setSettings({ mirrorX });
  }
}
