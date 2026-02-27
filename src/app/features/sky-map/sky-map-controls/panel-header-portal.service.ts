// panel-header-portal.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Portal } from '@angular/cdk/portal';
import { map, distinctUntilChanged } from 'rxjs/operators';

export type HeaderKey =
  | 'projection'
  | 'stars'
  | 'boundaries'
  | 'constellationLines'
  | 'starsLabel'
  | 'boundariesLabel'
  | 'boundariesLine'
  | 'panelLabel';

type Store = Record<HeaderKey, Portal<any> | null>;

@Injectable({ providedIn: 'root' })
export class PanelHeaderPortalService {
  private store$ = new BehaviorSubject<Store>({
    projection: null,
    stars: null,
    boundaries: null,
    constellationLines: null,
    starsLabel: null,
    boundariesLabel: null,
    boundariesLine: null,
    panelLabel: null,
  });

  register(key: HeaderKey, portal: Portal<any>) {
    this.store$.next({ ...this.store$.value, [key]: portal });
  }

  unregister(key: HeaderKey) {
    this.store$.next({ ...this.store$.value, [key]: null });
  }

  portalFor(key: HeaderKey): Observable<Portal<any> | null> {
    return this.store$.pipe(
      map((s) => s[key]),
      distinctUntilChanged()
    );
  }
}
