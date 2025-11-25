import { ProjectionName } from './projection-options.model';
import { Star } from './star.model';

export type StarSymbolShape = 'circle' | 'cross' | 'square' | 'icon';
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
}

export interface StarsLabelsSettings {
  visible: boolean;
  magnitudeRange: [number, number];
  position: StarLabelPosition;
  fontSize: number;
  maxLines: number;
  iconEnabled: boolean;
  borderEnabled: boolean;
  borderColor: string;
  textColor: string;
  backgroundColor: string;
  showBayer: boolean;
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
  positionKey: LabelStarPositionKey;
}

export type LabelStarPositionKey = 'right' | 'left' | 'top' | 'bottom';
