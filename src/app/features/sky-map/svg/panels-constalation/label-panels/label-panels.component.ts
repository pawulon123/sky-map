import { Component, inject, Input } from '@angular/core';
import { TaxtPolinesComponent } from '../../components/text-polines/text-polines.component';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { CommonModule } from '@angular/common';
import { ConstellationPanelVM, PanelLabel } from '../../../domain/models/panels.model';
import { getFullNameConstelation } from '../../../common/get-full-name-constelation';
import { map, Observable } from 'rxjs';
import { PolilineText } from '../../../domain/models/svg-general';

@Component({
  selector: 'g[app-label-panels]',
  imports: [CommonModule, TaxtPolinesComponent],
  templateUrl: './label-panels.component.html',
  styleUrl: './label-panels.component.css',
})
export class LabelPanelsComponent {
  @Input() panel: ConstellationPanelVM[] = [];

  private state = inject(SkyMapStateService);

  panelLabelSettings$ = this.state.labelPanelsSettings$;

  labels$: Observable<PolilineText[]> = this.panelLabelSettings$.pipe(
    map((settings: PanelLabel) => {
      const pos: LabelPanelPosition = settings?.position ?? 'centerBottom';
      const padX = 4;
      const padY = 24;

      return (this.panel ?? []).map<PolilineText>((p) => {
        const { x, y } = getPanelAnchor(p, pos, padX, padY);

        const full = getFullNameConstelation(p.constelationId).polish;

        return {
          x,
          y,
          lines: [full],
        };
      });
    })
  );
}

export type LabelPanelPosition = 'rightTop' | 'leftTop' | 'rightBottom' | 'leftBottom' | 'centerTop' | 'centerBottom';

const getPanelAnchor = (
  p: ConstellationPanelVM,
  pos: LabelPanelPosition,
  padX = 4,
  padY = 4
): { x: number; y: number } => {
  const left = p.x + padX;
  const right = p.x + p.w - padX;
  const top = p.y + padY;
  const bottom = p.y + p.h - padY;
  const centerX = p.x + p.w / 2;

  switch (pos) {
    case 'leftTop':
      return { x: left, y: top };
    case 'rightTop':
      return { x: right, y: top };
    case 'leftBottom':
      return { x: left, y: bottom };
    case 'rightBottom':
      return { x: right, y: bottom };
    case 'centerTop':
      return { x: centerX, y: top };
    case 'centerBottom':
      return { x: centerX, y: bottom };
  }
};
