import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ProjectionService } from '../../domain/services/projection/projection.service';
import { ModeProjection } from '../../domain/models/projection-options.model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { defaultProjectionSettings, modes } from '../../domain/default/projection';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CONSTELLATION_PL } from '../../domain/default/constalation-select';
import { Subscription } from 'rxjs';
import { MapProjectionControlsComponent } from '../map-projection-controls/map-projection-controls.component';
import { PanelsProjectionControlsComponent } from '../panels-projection-controls/panels-projection-controls.component';
import { MatDividerModule } from '@angular/material/divider';
import { HeaderPortalComponent } from '../header-portal.component';
@Component({
  selector: 'app-projection-controls',
  imports: [
    CommonModule,
    FormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatCheckboxModule,
    ReactiveFormsModule,
    MapProjectionControlsComponent,
    PanelsProjectionControlsComponent,
    MatDividerModule,
    HeaderPortalComponent,
  ],
  templateUrl: './projection-controls.component.html',
  styleUrl: './projection-controls.component.css',
  standalone: true,
})
export class ProjectionControlsComponent implements OnInit, OnDestroy {
  protected projectionSv = inject(ProjectionService);
  constalationSelectSub = new Subscription();
  constellationsCtrl = new FormControl<string[]>([], { nonNullable: true });
  CONSTELLATION_PL = CONSTELLATION_PL;

  modeCtrl = new FormControl<ModeProjection>(defaultProjectionSettings.mode, { nonNullable: true });
  modes = modes;
  modeSelectSub = new Subscription();

  ngOnInit() {
    this.constalationSelectSub = this.constalationSelectEv();
    this.modeSelectSub = this.modeSelectEv();
  }

  private constalationSelectEv() {
    this.constellationsCtrl.setValue(defaultProjectionSettings.selected);
    return this.constellationsCtrl.valueChanges.subscribe((selected) => {
      this.projectionSv.setSettings({ selected });
    });
  }
  private modeSelectEv() {
    this.modeCtrl.setValue(defaultProjectionSettings.mode);
    return this.modeCtrl.valueChanges.subscribe((mode) => {
      this.projectionSv.setSettings({ mode });
    });
  }

  selectAllConstellations(): void {
    const all = this.CONSTELLATION_PL.map((c) => c.value);
    this.constellationsCtrl.setValue(all);
  }

  clearAllConstellations(): void {
    this.constellationsCtrl.setValue([]);
  }

  ngOnDestroy() {
    this.constalationSelectSub.unsubscribe();
    this.modeSelectSub.unsubscribe();
  }
}
