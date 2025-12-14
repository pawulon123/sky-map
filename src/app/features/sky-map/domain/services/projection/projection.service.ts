import { Injectable, signal, computed } from '@angular/core';
import { defaultProjectionSettings } from '../../default/projection';
import { projectionCore } from './projection-core';
import { ProjectionSettings } from '../../models/projection-options.model';
import { Boundary } from '../../models/boundary.model';

@Injectable({ providedIn: 'root' })
export class ProjectionService {
  settings = signal<ProjectionSettings>(defaultProjectionSettings);

  private _projection = projectionCore(this.settings);

  setSettings(partial: Partial<ProjectionSettings>) {
    this.settings.update((settingsPrev: ProjectionSettings) => ({ ...settingsPrev, ...partial }));
  }

  getProjectionByLonLat(lonDeg: number, latDeg: number): [number, number] | null {
    const proj = this._projection()([lonDeg, latDeg]);
    return proj ? (proj as [number, number]) : null;
  }
}
