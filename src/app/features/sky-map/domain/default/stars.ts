import { StarsLayerSettings } from '../models/stars-layer-settings.model';

export const defaultStarsSettings: StarsLayerSettings = {
  symbols: {
    visible: true,
    shape: 'circle',
    size: 1.5,
    color: '#ffffff',
    strokeWidth: 0.2,
    strokeColor: '#1c7138ff',
    scaleByMagnitude: true,
  },
  labels: {
    visible: true,
    magnitudeRange: [-1, 6],
    position: 'top',
    fontSize: 10,
    maxLines: 2,
    iconEnabled: false,
    borderEnabled: false,
    borderColor: '#ffffff',
    textColor: '#ffffff',
    backgroundColor: '#000000',
  },
};
