import { svgDataDefault } from '../../../../core/default/svg-data';
import { ProjectionSettings } from '../models/projection-options.model';

export const defaultProjectionSettings: ProjectionSettings = {
  width: svgDataDefault.width,
  height: svgDataDefault.height,
  projectionName: 'equirect',
  mirrorX: false,
  selected: ['And', 'Ori'],
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
