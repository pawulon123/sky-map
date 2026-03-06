import { PositionConfig, StarsLayerSettings } from '../models/stars-layer-settings.model';

export const defaultStarsSettings: StarsLayerSettings = {
  symbols: {
    visible: true,
    ring: 0,
    magMax: 7,
    shape: 'star',
    size: 1.7,
    color: '#4205e8ff',
    strokeWidth: 0.2,
    strokeColor: '#1c7138ff',
    scaleByMagnitude: 0.4,
    fillOpacity: 0.5, // 0–1
    strokeOpacity: 0.5, // 0–1
  },
  labels: {
    visible: true,
    magnitudeRange: [-1, 6],
    position: 'top',
    fontSize: 5,
    showBayer: false,
    fontWeight: 'normal',

    stroke: '#000000',
    strokeWidth: 0,
    strokeOpacity: 1,
    fontFamily: 'Arial',
    letterSpacing: 1.5,
    colision: [],
    offsetXPx: 15,
    offsetYPx: 3,
  },
};

export const fontFamily = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Noto Sans',
  'Fira Sans',
  'Source Sans Pro',
  'Work Sans',
  'Lato',
  'Poppins',
  'Montserrat',
  'IBM Plex Sans',
  'Roboto Condensed',
  'Arial',
  'Helvetica',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'Segoe UI',
];
export const POSITION_CONFIGS: readonly PositionConfig[] = [
  { key: 'right', dx: 1, dy: 0, align: 'left' },
  { key: 'left', dx: -1, dy: 0, align: 'left' },
  { key: 'top', dx: 0, dy: -1, align: 'center' },
  { key: 'bottom', dx: 0, dy: 1, align: 'center' },
] as const;

export const LINE_SPACING = 1.1;
