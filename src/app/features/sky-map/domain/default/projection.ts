import { ProjectionSettings } from '../models/projection-options.model';

export const defaultProjectionSettings: ProjectionSettings = {
  width: 1200,
  height: 1200,
  projectionName: 'stereographic',
  mirrorX: false,
};
export const projections = [
  { value: 'stereographic', label: 'Stereograficzny' },
  { value: 'azimuthal', label: 'Azymutalny (Equidistant)' },
  { value: 'azimuthalEA', label: 'Azymutalny (Equal-Area)' },
  { value: 'orthographic', label: 'Ortograficzny' },
  { value: 'gnomonic', label: 'Gnomoniczny' },
  { value: 'mercator', label: 'Mercatora' },
  { value: 'equirect', label: 'Równikowy' },
];
