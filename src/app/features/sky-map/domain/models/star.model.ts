export interface Star {
  strokeOpacity: any;
  strokeColor: any;
  fillOpacity: any;
  starCy: any;
  starCx: any;
  bayer: string;
  id?: number | string;
  ra?: number;
  ra_deg?: number;
  dec: number;
  mag: number;
  name?: string;
  spect?: string | null;
  dist_pc?: number | null;
  __projected?: [number, number] | null; // ważne: może być null

  propSvg: any;
}

export interface StarsData {
  meta?: any;
  stars: Star[];
}
