import { Injectable, signal, computed } from '@angular/core';
import * as d3geo from 'd3-geo';

export type ProjectionName =
  | 'stereographic'
  | 'azimuthal'
  | 'azimuthalEA'
  | 'orthographic'
  | 'gnomonic'
  | 'mercator'
  | 'equirect';

@Injectable({ providedIn: 'root' })
export class ProjectionService {

  private _name = signal<ProjectionName>('stereographic');
  private _width = signal<number>(1200);
  private _height = signal<number>(1200);

  name() { return this._name(); }
  width() { return this._width(); }
  height() { return this._height(); }

  setName(n: ProjectionName) { this._name.set(n); }
  setSize(w: number, h: number) { this._width.set(w); this._height.set(h); }

  /** ✅ Główna projekcja — trzymana prywatnie */
  private _projection = computed<d3geo.GeoProjection>(() => {
    const w = this._width();
    const h = this._height();
    const cx = w / 2, cy = h / 2;
    let proj: d3geo.GeoProjection;

    switch (this._name()) {
      case 'stereographic':
        proj = d3geo.geoStereographic(); (proj as any).clipAngle(180); break;
      case 'azimuthal':
        proj = d3geo.geoAzimuthalEquidistant(); (proj as any).clipAngle(180); break;
      case 'azimuthalEA':
        proj = d3geo.geoAzimuthalEqualArea(); (proj as any).clipAngle(180); break;
      case 'orthographic':
        proj = d3geo.geoOrthographic(); (proj as any).clipAngle(90); break;
      case 'gnomonic':
        proj = d3geo.geoGnomonic(); (proj as any).clipAngle(90); break;
      case 'mercator':
        proj = d3geo.geoMercator(); break;
      default:
        proj = d3geo.geoEquirectangular(); break;
    }

    (proj as any).translate([cx, cy]);

    if (this._name() === 'equirect' || this._name() === 'mercator') {
      (proj as any).fitExtent([[40, 40], [w - 40, h - 40]], { type: 'Sphere' });
    } else {
      (proj as any).scale(Math.min(w, h) * 0.48);
    }

    return proj;
  });

  /** ✅ Publiczny accessor dla warstw */
 projection() {
    return this._projection();
  }

  /** ✅ Obsługa sfery i siatki */
  private _path = computed(() => d3geo.geoPath(this._projection()));
  private _graticuleGen = d3geo.geoGraticule().step([15, 15]);

  spherePath() {
    return this._path()({ type: 'Sphere' }) ?? '';
  }
  graticulePath() {
    return this._path()(this._graticuleGen()) ?? '';
  }

  /** ✅ Projekcja pojedynczego punktu */
  projectLonLat(lonDeg: number, latDeg: number): [number, number] | null {
    const p = this._projection()([lonDeg, latDeg]);
    return p ? (p as [number, number]) : null;
  }

   projectRaDec(raDeg: number, decDeg: number): [number, number] | null {
    return this.projectLonLat(raDeg, decDeg);
  }
}
