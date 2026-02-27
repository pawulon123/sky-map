import { Component, inject } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormsModule } from '@angular/forms';
import { SkyMapStateService } from '../../domain/services/sky-map-state/sky-map-state.service';
import { fontForLabelStars } from '../../domain/default/stars';
import { LabelPanelPosition, PanelLabel } from '../../domain/models/panels.model';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { panelLabelDefault } from '../../domain/default/label-panels';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HeaderPortalComponent } from '../header-portal.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-panels-label',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatSliderModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    HeaderPortalComponent,
    MatCheckboxModule,
  ],
  templateUrl: './panels-label.component.html',
  styleUrl: './panels-label.component.css',
})
export class PanelsLabelComponent {
  options: Array<{ value: LabelPanelPosition; label: string }> = [
    { value: 'leftTop', label: 'Lewy górny' },
    { value: 'centerTop', label: 'Środek górny' },
    { value: 'rightTop', label: 'Prawy górny' },
    { value: 'leftBottom', label: 'Lewy dolny' },
    { value: 'centerBottom', label: 'Środek dolny' },
    { value: 'rightBottom', label: 'Prawy dolny' },
  ];
  positionCtrl = new FormControl<LabelPanelPosition>('centerTop', { nonNullable: true });
  private state = inject(SkyMapStateService);
  settingsLabels = this.state.labelPanelsSettings$;
  position: LabelPanelPosition = panelLabelDefault.position;

  fonts = fontForLabelStars;

  update(prop: keyof PanelLabel, value: any) {
    this.state.updateLabelPanels({ [prop]: value });
  }
}
