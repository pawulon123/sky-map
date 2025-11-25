import { StarsLayerSettings } from '../models/stars-layer-settings.model';

export const defaultStarsSettings: StarsLayerSettings = {
  symbols: {
    visible: true,
    ring: 0,
    magMax: 7,
    shape: 'circle',
    size: 1.5,
    color: '#4205e8ff',
    strokeWidth: 0.2,
    strokeColor: '#1c7138ff',
    scaleByMagnitude: true,
  },
  labels: {
    visible: true,
    magnitudeRange: [-1, 6],
    position: 'top',
    fontSize: 10,
    showBayer: true,
    fontWeight: 'normal',
    stroke: '#000000',
    strokeWidth: 0,
    strokeOpacity: 1,
    fontFamily: 'Arial',
  },
};
