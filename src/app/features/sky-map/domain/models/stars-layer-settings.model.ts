import { Star } from './star.model';

export type StarLabelPosition = 'top' | 'bottom' | 'left' | 'right';

export interface StarsSymbolsSettings {
  visible: boolean;
  ring: number;
  magMax: number;
  shape: StarSymbolShape;
  size: number;
  color: string;
  strokeWidth: number;
  strokeColor: string;
  scaleByMagnitude: boolean;
  customSvgPath?: string; // zawartość atrybutu d z <path>
  customSvgScale?: number;
  // mnożnik wielkości (1 = bez zmian)
  fillOpacity: number; // 0–1
  strokeOpacity: number; // 0–1
  // mnożnik skali (domyślnie 1)
}

export interface StarsLabelsSettings {
  visible: boolean;
  magnitudeRange: [number, number];
  position: StarLabelPosition;
  fontSize: number;
  showBayer: boolean;
  fontWeight: string;
  stroke: string;
  strokeWidth: number;
  strokeOpacity: number;
  fontFamily: string;
  letterSpacing: number;
  colision: string[] | null;
}

export interface StarsLayerSettings {
  symbols: StarsSymbolsSettings;
  labels: StarsLabelsSettings;
}
export type StarKey = 'symbols' | 'labels';

export interface LabelBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface LabelPlacement {
  star: Star;
  x: number;
  y: number;
  positionKey: PositionKey;
}

export type PositionKey = 'right' | 'left' | 'top' | 'bottom';

export interface PositionConfig {
  key: PositionKey;
  dx: number;
  dy: number;
  align: 'left' | 'center';
}
// np. domain/models/sky-map-settings.model.ts
export type StarSymbolShape = 'circle' | 'ring' | 'star' | 'cross' | 'square' | 'triangle' | 'custom';
