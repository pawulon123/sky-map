import { BehaviorSubject } from 'rxjs';
import { StarKey, StarsLayerSettings } from '../../features/sky-map/domain/models/stars-layer-settings.model';
import { update } from './utils-function';
import { BoundaryKey, BoundaryLayerSettings } from '../../features/sky-map/domain/models/boundary.model';

export function updateEndNext<S extends Record<string, any>>(partial: Partial<S>, subject: BehaviorSubject<S>): void;
// export function updateEndNext<S extends Record<string, any>>(partial: Partial<S>, subject: BehaviorSubject<S>): void;

export function updateEndNext<S extends BoundaryLayerSettings, K extends BoundaryKey>(
  partial: Partial<S[K]>,
  subject: BehaviorSubject<S>,
  firstLevelNestingKey: K
): void;
export function updateEndNext<S extends StarsLayerSettings, K extends StarKey>(
  partial: Partial<S[K]>,
  subject: BehaviorSubject<S>,
  firstLevelNestingKey: K
): void;

export function updateEndNext<S extends Record<string, any>, K extends keyof S & string>(
  partial: Partial<S> | Partial<S[K]>,
  subject: BehaviorSubject<S>,
  firstLevelNestingKey?: K
): void {
  const current = subject.getValue();
  const next: S = update(partial, current, firstLevelNestingKey);
  subject.next(next);
}
