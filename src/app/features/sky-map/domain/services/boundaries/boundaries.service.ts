import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BoundariesData, Boundary } from '../../models/boundary.model';

// const D3C_BASE = 'https://cdn.jsdelivr.net/npm/d3-celestial@0.7.35/data/constellations.bounds.json';
const D3C_BASE = 'boundaries-constalation.json';

@Injectable({ providedIn: 'root' })
export class BoundariesService {
  private platformId = inject(PLATFORM_ID);

  private _loaded = signal(false);
  loaded = this._loaded.asReadonly();

  private _data = signal<BoundariesData>({ meta: {}, boundaries: [] });
  data = this._data.asReadonly();

  private lonToRa(lon: number) {
    // normalizuj lon do [0,360)
    // bez negacji -lon
    const ra = ((lon % 360) + 360) % 360;
    return ra;
  }

  private featureToSegments(feat: any): [number, number][][] {
    const g = feat?.geometry || {};

    // teraz toRaDec NIE odwraca znaku
    const toRaDec = ([lon, lat]: [number, number]) => [this.lonToRa(lon), lat] as [number, number];

    if (g.type === 'LineString') {
      return [(g.coordinates as [number, number][]).map(toRaDec)];
    }

    if (g.type === 'MultiLineString') {
      return (g.coordinates as [number, number][][]).map((seg) => seg.map(toRaDec));
    }

    if (g.type === 'Polygon') {
      return g.coordinates?.[0]?.length ? [g.coordinates[0].map(toRaDec)] : [];
    }

    if (g.type === 'MultiPolygon') {
      const polys = g.coordinates as [number, number][][][];
      return polys.map((poly) => (poly?.[0] || []).map(toRaDec)).filter((seg) => seg.length);
    }

    return [];
  }

  async loadOnce() {
    if (!isPlatformBrowser(this.platformId) || this._loaded()) return;

    const url = `${D3C_BASE}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const gj = await res.json();

    const boundaries: Boundary[] = (gj || []).map((f: any) => {
      const p = f.properties || {};

      const name = mapConstellation(f.id).polish;
      const abbrev = f.id;
      const segments = this.featureToSegments(f);
      const first = segments?.[0]?.[0] || null;
      const label = first ? { ra_deg: first[0], dec: first[1] } : null;
      return { abbrev, name, segments, label };
    });

    this._data.set({ meta: { source: 'IAU via d3-celestial', epoch: 'J2000' }, boundaries });
    this._loaded.set(true);
  }
}
const mapConstellation = (abbrev: string) => {
  return (
    CONSTELLATION_NAMES[abbrev] ?? {
      latin: 'Nieznane',
      polish: 'Nieznane',
    }
  );
};

export const CONSTELLATION_NAMES: Record<string, { latin: string; polish: string }> = {
  And: { latin: 'Andromeda', polish: 'Andromeda' },
  Ant: { latin: 'Antlia', polish: 'Pompa Powietrzna' },
  Aps: { latin: 'Apus', polish: 'Rajski Ptak' },
  Aqr: { latin: 'Aquarius', polish: 'Wodnik' },
  Aql: { latin: 'Aquila', polish: 'Orzeł' },
  Ara: { latin: 'Ara', polish: 'Ołtarz' },
  Ari: { latin: 'Aries', polish: 'Baran' },
  Aur: { latin: 'Auriga', polish: 'Woźnica' },
  Boo: { latin: 'Boötes', polish: 'Wolarz' },
  Cae: { latin: 'Caelum', polish: 'Rylec' },
  Cam: { latin: 'Camelopardalis', polish: 'Żyrafa' },
  Cnc: { latin: 'Cancer', polish: 'Rak' },
  CVn: { latin: 'Canes Venatici', polish: 'Psy Gończe' },
  CMa: { latin: 'Canis Major', polish: 'Wielki Pies' },
  CMi: { latin: 'Canis Minor', polish: 'Mały Pies' },
  Cap: { latin: 'Capricornus', polish: 'Koziorożec' },
  Car: { latin: 'Carina', polish: 'Kila' },
  Cas: { latin: 'Cassiopeia', polish: 'Kasjopea' },
  Cen: { latin: 'Centaurus', polish: 'Centaur' },
  Cep: { latin: 'Cepheus', polish: 'Cefeusz' },
  Cet: { latin: 'Cetus', polish: 'Wieloryb' },
  Cha: { latin: 'Chamaeleon', polish: 'Kameleon' },
  Cir: { latin: 'Circinus', polish: 'Cyrkiel' },
  Col: { latin: 'Columba', polish: 'Gołąb' },
  Com: { latin: 'Coma Berenices', polish: 'Warkocz Bereniki' },
  CrA: { latin: 'Corona Australis', polish: 'Korona Południowa' },
  CrB: { latin: 'Corona Borealis', polish: 'Korona Północna' },
  Crv: { latin: 'Corvus', polish: 'Kruk' },
  Crt: { latin: 'Crater', polish: 'Puchar' },
  Cru: { latin: 'Crux', polish: 'Krzyż Południa' },
  Cyg: { latin: 'Cygnus', polish: 'Łabędź' },
  Del: { latin: 'Delphinus', polish: 'Delfin' },
  Dor: { latin: 'Dorado', polish: 'Miecznik' },
  Dra: { latin: 'Draco', polish: 'Smok' },
  Equ: { latin: 'Equuleus', polish: 'Źrebię' },
  Eri: { latin: 'Eridanus', polish: 'Erydan' },
  For: { latin: 'Fornax', polish: 'Piec' },
  Gem: { latin: 'Gemini', polish: 'Bliźnięta' },
  Gru: { latin: 'Grus', polish: 'Żuraw' },
  Her: { latin: 'Hercules', polish: 'Herkules' },
  Hor: { latin: 'Horologium', polish: 'Zegar' },
  Hya: { latin: 'Hydra', polish: 'Hydra' },
  Hyi: { latin: 'Hydrus', polish: 'Mała Hydra' },
  Ind: { latin: 'Indus', polish: 'Indianin' },
  Lac: { latin: 'Lacerta', polish: 'Jaszczurka' },
  Leo: { latin: 'Leo', polish: 'Lew' },
  LMi: { latin: 'Leo Minor', polish: 'Mały Lew' },
  Lep: { latin: 'Lepus', polish: 'Zając' },
  Lib: { latin: 'Libra', polish: 'Waga' },
  Lup: { latin: 'Lupus', polish: 'Wilk' },
  Lyn: { latin: 'Lynx', polish: 'Ryś' },
  Lyr: { latin: 'Lyra', polish: 'Lutnia' },
  Men: { latin: 'Mensa', polish: 'Stół' },
  Mic: { latin: 'Microscopium', polish: 'Mikroskop' },
  Mon: { latin: 'Monoceros', polish: 'Jednorożec' },
  Mus: { latin: 'Musca', polish: 'Mucha' },
  Nor: { latin: 'Norma', polish: 'Węgielnica' },
  Oct: { latin: 'Octans', polish: 'Oktant' },
  Oph: { latin: 'Ophiuchus', polish: 'Wężownik' },
  Ori: { latin: 'Orion', polish: 'Orion' },
  Pav: { latin: 'Pavo', polish: 'Paw' },
  Peg: { latin: 'Pegasus', polish: 'Pegaz' },
  Per: { latin: 'Perseus', polish: 'Perseusz' },
  Phe: { latin: 'Phoenix', polish: 'Feniks' },
  Pic: { latin: 'Pictor', polish: 'Malarz' },
  Psc: { latin: 'Pisces', polish: 'Ryby' },
  PsA: { latin: 'Piscis Austrinus', polish: 'Ryba Południowa' },
  Pup: { latin: 'Puppis', polish: 'Rufa' },
  Pyx: { latin: 'Pyxis', polish: 'Kompas' },
  Ret: { latin: 'Reticulum', polish: 'Sieć' },
  Sge: { latin: 'Sagitta', polish: 'Strzała' },
  Sgr: { latin: 'Sagittarius', polish: 'Strzelec' },
  Sco: { latin: 'Scorpius', polish: 'Skorpion' },
  Scl: { latin: 'Sculptor', polish: 'Rzeźbiarz' },
  Sct: { latin: 'Scutum', polish: 'Tarcza' },
  Ser: { latin: 'Serpens', polish: 'Wąż' },
  Sex: { latin: 'Sextans', polish: 'Sekstant' },
  Tau: { latin: 'Taurus', polish: 'Byk' },
  Tel: { latin: 'Telescopium', polish: 'Teleskop' },
  Tri: { latin: 'Triangulum', polish: 'Trójkąt' },
  TrA: { latin: 'Triangulum Australe', polish: 'Trójkąt Południowy' },
  Tuc: { latin: 'Tucana', polish: 'Tukan' },
  UMa: { latin: 'Ursa Major', polish: 'Wielka Niedźwiedzica' },
  UMi: { latin: 'Ursa Minor', polish: 'Mała Niedźwiedzica' },
  Vel: { latin: 'Vela', polish: 'Żagiel' },
  Vir: { latin: 'Virgo', polish: 'Panna' },
  Vol: { latin: 'Volans', polish: 'Ryba Latająca' },
  Vul: { latin: 'Vulpecula', polish: 'Lisek' },
};
