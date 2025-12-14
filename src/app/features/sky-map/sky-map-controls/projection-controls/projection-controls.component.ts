import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ProjectionService } from '../../domain/services/projection/projection.service';
import { SkyMapStateService } from '../../domain/services/sky-map-state/sky-map-state.service';
import { ProjectionName } from '../../domain/models/projection-options.model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { defaultProjectionSettings, projections } from '../../domain/default/projection';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatOption, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CONSTELLATION_PL } from '../../domain/default/constalation-select';
import { Subscriber, Subscription } from 'rxjs';

@Component({
  selector: 'app-projection-controls',
  imports: [
    CommonModule,
    FormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './projection-controls.component.html',
  styleUrl: './projection-controls.component.css',
  standalone: true,
})
export class ProjectionControlsComponent implements OnInit, OnDestroy {
  protected projectionSv = inject(ProjectionService);
  private state = inject(SkyMapStateService);

  constalationSelectSub?: Subscription;
  starsSettings$ = this.state.starsLayerSettings$;
  projections = projections;
  constellationsCtrl = new FormControl<string[]>([], { nonNullable: true });
  CONSTELLATION_PL = CONSTELLATION_PL;

  ngOnInit() {
    this.constalationSelectSub = this.constalationSelectEv();
  }

  private constalationSelectEv() {
    this.constellationsCtrl.setValue(defaultProjectionSettings.selected);
    return this.constellationsCtrl.valueChanges.subscribe((selected) => {
      this.projectionSv.setSettings({ selected });
    });
  }

  setProjection(projectionName: ProjectionName) {
    this.projectionSv.setSettings({ projectionName });
  }

  setSize(width: number, height: number) {
    this.projectionSv.setSettings({ width, height });
  }

  width() {
    return this.projectionSv.settings().width;
  }
  height() {
    return this.projectionSv.settings().height;
  }

  toggleMirrorX(mirrorX: boolean) {
    this.projectionSv.setSettings({ mirrorX });
  }

  ngOnDestroy(): void {
    if (this.constalationSelectSub) this.constalationSelectSub.unsubscribe();
  }
}
