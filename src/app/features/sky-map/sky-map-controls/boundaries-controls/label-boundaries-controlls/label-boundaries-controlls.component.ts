import { Component, inject } from '@angular/core';
import { BoundaryLabels } from '../../../domain/models/boundary.model';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderPortalComponent } from '../../header-portal.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-label-boundaries-controlls',
  imports: [
    CommonModule,
    FormsModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSliderModule,
    HeaderPortalComponent,
    MatCheckboxModule,
  ],
  templateUrl: './label-boundaries-controlls.component.html',
  styleUrl: './label-boundaries-controlls.component.css',
})
export class LabelBoundariesControllsComponent {
  private state = inject(SkyMapStateService);

  boundariesSettings$ = this.state.boundariesLayerSettings$;

  update(key: keyof BoundaryLabels, value: any) {
    this.state.updateBoundaryLabel({ [key]: value });
  }
}
