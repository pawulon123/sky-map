// labels-layout.strategy.ts
import { Star } from '../../../domain/models/star.model';
import { LabelPlacement } from '../../../domain/models/stars-layer-settings.model';

export interface LabelsLayoutStrategy {
  computeLabelLayout(getLines: (star: Star) => string[]): LabelPlacement[];
}
