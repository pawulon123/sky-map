import { BoundaryLayerSettings } from '../models/boundary.model';

export const boundaryDefaultSettings: BoundaryLayerSettings = {
  lines: {
    visible: true,
    color: 'blue',
    hitWidth: 1,
    lineWidth: 2,
    hoverColor: 'green',
    dashSize: 50,
    strokeOpacity: 0.5,
    style: 'solid',
    hoverScale: 1,
    dasharray: '',
  },
  labels: {
    visible: false,
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
