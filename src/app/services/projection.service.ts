import { Injectable, signal, computed } from '@angular/core';
import * as d3geo from 'd3-geo';
import { StarsService } from './stars.service';
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
  // --- stan reaktywny ---
  private _name = signal<ProjectionName>('stereographic');
  private _width = signal<number>(1200);
  private _height = signal<number>(1200);

  // PUBLIC GETTERY
  name() {
    return this._name();
  }
  width() {
    return this._width();
  }
  height() {
    return this._height();
  }

  // PUBLIC SETTERY (AppComponent woła to po kliknięciu UI)
  setName(n: ProjectionName) {
    this._name.set(n);
  }
  setSize(w: number, h: number) {
    this._width.set(w);
    this._height.set(h);
  }

  /**
   * Główna projekcja d3-geo zależna od bieżącego trybu (_name)
   * i rozmiaru płótna (_width/_height).
   *
   * Uwaga:
   * - dla projekcji pełnoekranowych (equirect, mercator)
   *   dopasowujemy całą "Sferę" do prostokąta z marginesem (fitExtent)
   * - dla projekcji kołowych (stereo, ortho itd.)
   *   ustawiamy translate na środek i skalę ręcznie
   */
  private _projection = computed<d3geo.GeoProjection>(() => {
    const w = this._width();
    const h = this._height();

    const cx = w / 2;
    const cy = h / 2;

    let proj: d3geo.GeoProjection;

    switch (this._name()) {
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

  /** Path generator do rysowania sfery, kratownicy itd. */
  private _path = computed(() => d3geo.geoPath(this._projection()));

  private _graticuleGen = d3geo.geoGraticule().step([15, 15]);

  /** obrys "krawędzi mapy": dla projekcji kołowych to będzie koło, dla mercatora prostokąt */
  spherePath() {
    return this._path()({ type: 'Sphere' }) ?? '';
  }

  /** siatka RA/Dec */
  graticulePath() {
    return this._path()(this._graticuleGen()) ?? '';
  }

  /**
   * Projekcja punktu (lon, lat) -> [x,y]
   * lon,lat w stopniach (konwencja geograficzna d3-geo)
   */
  projectLonLat(lonDeg: number, latDeg: number): [number, number] | null {
    const p = this._projection()([lonDeg, latDeg]);
    return p ? (p as [number, number]) : null;
  }

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
  projectRaDec(raDeg: number, decDeg: number): [number, number] | null {
    return this.projectLonLat(raDeg, decDeg);
  }

  /**
   * Jeśli ktoś (np. w przyszłości zoom/pan) potrzebuje surowej projekcji d3,
   * np. żeby użyć proj.invert([x,y]) – udostępniamy ją.
   */
  projection() {
    return this._projection();
  }

  reprojectStars(starsSvc: StarsService) {
    const mode = this.name();
    const w = this.width();
    const h = this.height();

    const projFn = (lon: number, lat: number) => this.projectRaDec(lon, lat);

    // NOWA LOGIKA:
    // Chcemy RA rosnące w lewo w KAŻDEJ projekcji,
    // więc zawsze odbijamy w poziomie.
    const mirror = true;

    starsSvc.updateProjection(projFn, w, { mirrorX: mirror });

    console.log('[ProjectionService.reprojectStars]', 'mode=', mode, 'mirrorX=', mirror, 'w=', w, 'h=', h);
  }
}
