import { Star } from '../domain/models/star.model';
import { StarsLayerSettings } from '../domain/models/stars-layer-settings.model';

export function createRadius(star: Star, settings: StarsLayerSettings['symbols']) {
  const rBase = radiusFromMag(star);
  const magScale = magnitudeScale(star.mag, settings.scaleByMagnitude ?? 0);
  const scale = (settings.size ?? 1) * magScale;
  const r = rBase * scale;
  return r;
}
export function getPropBaseRadius(
  r: number,
  { strokeWidth, fillOpacity: fo, strokeOpacity: so, strokeColor: sc, color, shape }: StarsLayerSettings['symbols']
) {
  return {
    baseStrokeWidth: r * 0.25 * (strokeWidth ?? 1),
    ringStrokeWidth: r * (strokeWidth ?? 0.4),
    crossStrokeWidth: r * 0.3 * (strokeWidth ?? 1),
    fillOpacity: fo ?? 1,
    strokeOpacity: so ?? 1,
    strokeColor: sc ?? color ?? 'currentColor',
    fillColor: shape === 'ring' ? 'none' : (color ?? 'currentColor'),
    hasFill: !!fo,
    opacity: fo,
  };
}

function magnitudeScale(
  mag: number | null | undefined,
  strength0to50: number,
  minMag = -1.5,
  maxMag = 8,
  minScale = 0.35,
  maxScale = 3.2,
  gamma = 2.9
): number {
  const strength = Math.max(0, Math.min(50, strength0to50));
  if (strength === 0) return 1;

  const m = Math.max(minMag, Math.min(maxMag, mag ?? 6));

  // t: 0..1 (0 = najsłabsze, 1 = najjaśniejsze)
  let t = (maxMag - m) / (maxMag - minMag);

  // nieliniowe wzmocnienie kontrastu
  t = Math.pow(t, gamma);

  const base = minScale + t * (maxScale - minScale);

  const k = strength / 50;
  return 1 + k * (base - 1);
}
function radiusFromMag(s: Star, rMin = 0.2, rMax = 2.8): number {
  const mag = s.mag;
  const clamped = Math.max(-1.5, Math.min(8, mag ?? 6));
  const t = (8 - (clamped + 1.5)) / 9.5;
  return rMin + t * (rMax - rMin);
}
