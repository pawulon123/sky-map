export interface Star {
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
  con: string;
  propSvg: any;
  constelationId: string;
}

export interface StarsData {
  meta?: any;
  stars: Star[];
}
