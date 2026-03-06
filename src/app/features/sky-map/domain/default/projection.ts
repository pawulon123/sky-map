import { svgDataDefault } from '../../../../core/default/svg-data';
import { ModeProjection, ProjectionSettings } from '../models/projection-options.model';

export const defaultProjectionSettings: ProjectionSettings = {
  width: svgDataDefault.width,
  height: svgDataDefault.height,
  projectionName: 'equirect',
  mirrorX: false,
  selected: ['And', 'Ori'],
  mode: 'map',
  panelSize: {
    w: 400,
    h: 300,
  },
  gap: 10,
  padding: 40,
  columns: 8,
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
export const modes: Array<{ value: ModeProjection; label: string }> = [
  { value: 'panels', label: 'Panele' },
  { value: 'map', label: 'Mapa' },
];
