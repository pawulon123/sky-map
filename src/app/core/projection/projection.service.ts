import { Injectable, computed, signal } from '@angular/core';
import * as d3geo from 'd3-geo';
import type { ProjectionName } from './projection-name.type';

@Injectable({ providedIn: 'root' })
export class ProjectionService {
  // Publiczne sygnały rozmiaru
  width  = signal<number>(1200);
  height = signal<number>(1200);

  // Nazwa projekcji (sygnał)
  name = signal<ProjectionName>('stereographic');

  // Fabryka projekcji d3-geo na bazie stanu
  projection = computed(() => {
    const w = this.width();
    const h = this.height();
    const cx = w / 2, cy = h / 2;

    let proj: d3geo.GeoProjection;
    switch (this.name()) {
      case 'stereographic':
        proj = d3geo.geoStereographic(); (proj as any).clipAngle(180); break;
      case 'azimuthal':      // Azimuthal Equidistant
        proj = d3geo.geoAzimuthalEquidistant(); (proj as any).clipAngle(180); break;
      case 'azimuthalEA':    // Azimuthal Equal-Area
        proj = d3geo.geoAzimuthalEqualArea(); (proj as any).clipAngle(180); break;
      case 'orthographic':
        proj = d3geo.geoOrthographic(); (proj as any).clipAngle(90); break;
      case 'gnomonic':
        proj = d3geo.geoGnomonic(); (proj as any).clipAngle(90); break;
      case 'mercator':
        proj = d3geo.geoMercator(); break;
      case 'equirect':
      default:
        proj = d3geo.geoEquirectangular(); break;
    }

    (proj as any).translate([cx, cy]);

    if (this.name() === 'equirect' || this.name() === 'mercator') {
      (proj as any).fitExtent([[40, 40], [w - 40, h - 40]], { type: 'Sphere' });
    } else {
      const scale = Math.min(w, h) * 0.48;
      (proj as any).scale(scale);
    }
    return proj;
  });

  // Ścieżkownik i podstawowe ścieżki
  private pathGen = computed(() => d3geo.geoPath(this.projection()));
  private graticule = d3geo.geoGraticule().step([15, 15]);

  spherePath = computed(() => this.pathGen()({ type: 'Sphere' }) || undefined);
  graticulePath = computed(() => this.pathGen()(this.graticule()) || undefined);

  // API używane przez komponenty:
  setName(name: ProjectionName) {
    this.name.set(name);
  }
  setSize(w: number, h: number) {
    if (Number.isFinite(w) && w > 0) this.width.set(w);
    if (Number.isFinite(h) && h > 0) this.height.set(h);
  }
}
