export interface Asterism {
  abbrev: string;
  name?: string;
  segments: [number, number][][];
  label?: { ra_deg: number; dec: number } | null;
}
export interface AsterismsData {
  meta?: any;
  items: Asterism[];
}
export interface AsterismSettings {
  visible: boolean;
  color: string;
}
