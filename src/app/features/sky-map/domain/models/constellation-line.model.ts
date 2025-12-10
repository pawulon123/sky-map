export interface ConstellationLineSettings {
  visible: boolean;
  color: string;
  style: StyleConstalationLines;
  dashSize: number;
  dasharray: string | null;
  lineWidth: number;
  dashOffset: number;
  strokeLinecap: StrokeLinecap;
  linejoin: Linejoin;
  strokeOpacity: number;
}
export type StyleConstalationLines = 'dashed' | 'solid';
export type StrokeLinecap = 'round' | 'dashed' | 'butt';
export type Linejoin = 'miter' | 'round' | 'bevel';

export type RaDec = [number, number];
export type LonDec = [number, number];
export type Acc = {
  chunks: LonDec[][];
  current: LonDec[];
  prevLon: number | null;
};
