import { Component, inject } from '@angular/core';
import { ProjectionService } from '../../domain/services/projection/projection.service';
import { SkyMapStateService } from '../../domain/services/sky-map-state/sky-map-state.service';
import { RefreshProjectionService } from '../../domain/services/projection/refresh-projection.service';
import { ProjectionName } from '../../domain/models/projection-options.model';

@Component({
  selector: 'app-projection-controls',
  imports: [],
  templateUrl: './projection-controls.component.html',
  styleUrl: './projection-controls.component.css',
})
export class ProjectionControlsComponent {
  private state = inject(SkyMapStateService);
  starsSettings$ = this.state.starsLayerSettings$;

  private projectionSv = inject(ProjectionService);

  setProjection(projectionName: ProjectionName) {
    this.projectionSv.setSettings({ projectionName });
    // this.projectionSv.setName(projectionName);
    // this.state.updateProjection({projectionName})
  }

  setSize(width: number, height: number) {
    this.projectionSv.setSettings({ width, height });
    //  this.state.updateProjection({width, height})//sprzężenie czasowe
  }

  width() {
    return this.projectionSv.settings().width;
  }
  height() {
    return this.projectionSv.settings().height;
  }
}
