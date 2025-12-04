import { BoundaryLayerSettings } from '../models/boundary.model';

export const boundaryDefaultSettings: BoundaryLayerSettings = {
  lines: {
    visible: true,
    color: 'blue',
  },
  labels: {
    visible: true,
    language: 'polish',
    fontFamily: 'Arial',
    letterSpacing: 2,
    fontSize: 10,
    fontWeight: 'normal',
    stroke: '#000000',
    strokeWidth: 0,
    strokeOpacity: 1,
  },
};
