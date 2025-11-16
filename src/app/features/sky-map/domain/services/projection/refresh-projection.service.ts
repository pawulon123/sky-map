import { inject, Injectable } from '@angular/core';
import { StarsService } from '../stars/stars.service';
import { ProjectionService } from './projection.service';

@Injectable({ providedIn: 'root' })
export class RefreshProjectionService {
  private starSv = inject(StarsService);
  private projectionSv = inject(ProjectionService);

  // refreshStars(
  //   projFn: (lon: number, lat: number) => [number, number] | null,
  //   w: number,
  //   options: { mirrorX: boolean }
  // ) {
  //   this.starSv.updateProjection(projFn, w, options);
  // }

  reprojectStars() {
    const projFn = (lon: number, lat: number) => this.projectionSv.getProjectionByLonLat(lon, lat);

    const w = this.projectionSv.settings().width;

    const mirror = true;

    this.starSv.updateProjection(projFn, w, { mirrorX: mirror });
  }

  loadOnceEndRefresh() {
    this.starSv.loadOnce(this.reprojectStars.bind(this));
  }
}
