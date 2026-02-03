import { Star } from '../../../domain/models/star.model';
import { LabelBox, LabelPlacement, StarsLabelsSettings } from '../../../domain/models/stars-layer-settings.model';
import { isInRange } from '../../../../../core/utils/utils-function';
import { defaultStarsSettings } from '../../../domain/default/stars';
import { tryPlaceLabelForStar } from './try-place-label';

export interface LabelLayoutEngineParams {
  settings: StarsLabelsSettings;
  stars: Star[];
  getLabelLines: (star: Star) => string[];
  collisionsEnabled?: boolean; // <-- przełącznik koli  ji
}

export function computeLabelLayoutEngine(params: LabelLayoutEngineParams): LabelPlacement[] {
  const { settings, stars, getLabelLines, collisionsEnabled = true } = params;

  if (!settings.visible) return [];

  const fontSize = settings.fontSize ?? defaultStarsSettings.labels.fontSize;
  const letterSpacing = settings.letterSpacing ?? 0;

  // legacy fallback
  const offsetPxRaw = (settings as any).offsetPx;
  const legacyOffset = Number.isFinite(offsetPxRaw)
    ? Number(offsetPxRaw)
    : ((defaultStarsSettings.labels as any).offsetPx ?? 4);

  // NEW: osobne osie
  const offsetXPxRaw = (settings as any).offsetXPx;
  const offsetYPxRaw = (settings as any).offsetYPx;

  const offsetXPx = Number.isFinite(offsetXPxRaw) ? Number(offsetXPxRaw) : legacyOffset;

  const offsetYPx = Number.isFinite(offsetYPxRaw) ? Number(offsetYPxRaw) : legacyOffset;

  // NOWE: zawsze licz liczbę, nigdy undefined

  const offsetPx = Number.isFinite(offsetPxRaw)
    ? Number(offsetPxRaw)
    : ((defaultStarsSettings.labels as any).offsetPx ?? 4);

  const cellSize = fontSize * 8;

  const grid = collisionsEnabled ? new Map<string, LabelBox[]>() : null;
  const candidates = filterAndSortCandidateStars(stars, settings);

  const placements: LabelPlacement[] = [];

  for (const star of candidates) {
    const placement = tryPlaceLabelForStar({
      star,
      fontSize,
      letterSpacing,
      cellSize,
      offsetXPx,
      offsetYPx,
      grid,
      getLabelLines,
      collisionsEnabled,
    });

    if (placement) placements.push(placement);
  }

  return placements;
}

const filterAndSortCandidateStars = (labeledStars: Star[], settings: StarsLabelsSettings): Star[] => {
  const { magnitudeRange } = settings;
  return [...labeledStars].filter((star) => isInRange(star.mag, magnitudeRange)).sort((a, b) => a.mag - b.mag);
};
