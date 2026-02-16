import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ProjectionService } from '../../domain/services/projection/projection.service';
import { SkyMapStateService } from '../../domain/services/sky-map-state/sky-map-state.service';
import { ModeProjection, ProjectionName } from '../../domain/models/projection-options.model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { defaultProjectionSettings, modes, projections } from '../../domain/default/projection';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatOption, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CONSTELLATION_PL } from '../../domain/default/constalation-select';
import { Subscriber, Subscription } from 'rxjs';
import { MapProjectionControlsComponent } from '../map-projection-controls/map-projection-controls.component';
import { PanelsProjectionControlsComponent } from '../panels-projection-controls/panels-projection-controls.component';

@Component({
  selector: 'app-projection-controls',
  imports: [
    CommonModule,
    FormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    // MatInputModule,
    MatCheckboxModule,
    // MatSelectModule,
    ReactiveFormsModule,
    MapProjectionControlsComponent,
    PanelsProjectionControlsComponent,
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

  ngOnDestroy(): void {
    this.constalationSelectSub.unsubscribe();
    this.modeSelectSub.unsubscribe();
  }
}
