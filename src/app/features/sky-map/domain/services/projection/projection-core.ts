import { computed, Signal } from '@angular/core';
import * as d3geo from 'd3-geo';
import { ProjectionSettings } from '../../models/stars-layer-settings.model';

export const projectionCore = (settings: Signal<ProjectionSettings>) => {
  return computed<d3geo.GeoProjection>(() => {
    // ODCZYT sygnału – tu jest reaktivność
    const { width: w, height: h, projectionName: name } = settings();

    const cx = w / 2;
    const cy = h / 2;

    let proj: d3geo.GeoProjection;

    switch (name) {
      case 'stereographic': {
        proj = d3geo.geoStereographic();
        (proj as any).clipAngle(180);
        // rzut "dyskowy"
        (proj as any).translate([cx, cy]);
        (proj as any).scale(Math.min(w, h) * 0.48);
        break;
      }

      case 'azimuthal': {
        proj = d3geo.geoAzimuthalEquidistant();
        (proj as any).clipAngle(180);
        (proj as any).translate([cx, cy]);
        (proj as any).scale(Math.min(w, h) * 0.48);
        break;
      }

      case 'azimuthalEA': {
        proj = d3geo.geoAzimuthalEqualArea();
        (proj as any).clipAngle(180);
        (proj as any).translate([cx, cy]);
        (proj as any).scale(Math.min(w, h) * 0.48);
        break;
      }

      case 'orthographic': {
        proj = d3geo.geoOrthographic();
        (proj as any).clipAngle(90);
        (proj as any).translate([cx, cy]);
        (proj as any).scale(Math.min(w, h) * 0.48);
        break;
      }

      case 'gnomonic': {
        proj = d3geo.geoGnomonic();
        (proj as any).clipAngle(90);
        (proj as any).translate([cx, cy]);
        (proj as any).scale(Math.min(w, h) * 0.48);
        break;
      }

      case 'mercator': {
        proj = d3geo.geoMercator();
        // dopasuj całą kulę z marginesem 40px
        (proj as any).fitExtent(
          [
            [40, 40],
            [w - 40, h - 40],
          ],
          { type: 'Sphere' }
        );
        break;
      }

      case 'equirect':
      default: {
        proj = d3geo.geoEquirectangular();
        (proj as any).fitExtent(
          [
            [40, 40],
            [w - 40, h - 40],
          ],
          { type: 'Sphere' }
        );
        break;
      }
    }

    return proj;
  });
};
