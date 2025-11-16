import { Injectable, signal, computed } from '@angular/core';
import { defaultProjectionSettings } from '../../default/projection';
import { projectionCore } from './projection-core';
import { ProjectionSettings } from '../../models/projection-options.model';

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

  /** Path generator do rysowania sfery, kratownicy itd. */
  // private _path = computed(() => d3geo.geoPath(this._projection()));

  // private _graticuleGen = d3geo.geoGraticule().step([15, 15]);

  /** obrys "krawędzi mapy": dla projekcji kołowych to będzie koło, dla mercatora prostokąt */
  // spherePath() {
  //   return this._path()({ type: 'Sphere' }) ?? '';
  // }

  /** siatka RA/Dec */
  // graticulePath() {
  //   return this._path()(this._graticuleGen()) ?? '';
  // }

  /**
   * Projekcja punktu (lon, lat) -> [x,y]
   * lon,lat w stopniach (konwencja geograficzna d3-geo)
   */

  /**
   * Projekcja RA/Dec (w stopniach) -> [x,y] piksele.
   *
   * Założenie:
   * - traktujemy RA jako długość geograficzną (lon) bez zmiany znaku.
   * - odbicie osi X (RA rośnie w lewo) dalej robisz w warstwach
   *   przez `xMirrored = width - x`.
   *
   * To utrzymuje kompatybilność z Twoim działającym kodem gwiazd / granic.
   */
  // projectRaDec(raDeg: number, decDeg: number): [number, number] | null {
  //   return this.projectLonLat(raDeg, decDeg);
  // }
}
