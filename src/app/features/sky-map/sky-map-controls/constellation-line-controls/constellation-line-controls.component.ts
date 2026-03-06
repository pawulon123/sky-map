import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SkyMapStateService } from '../../domain/services/sky-map-state/sky-map-state.service';
import { ConstellationLineSettings } from '../../domain/models/constellation-line.model';

// Angular Material
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HeaderPortalComponent } from '../header-portal.component';
import { LineControllComponent } from '../components/line-controll/line-controll.component';

@Component({
  selector: 'app-constellation-line-controls',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    HeaderPortalComponent,
    LineControllComponent,
  ],
  templateUrl: './constellation-line-controls.component.html',
  styleUrl: './constellation-line-controls.component.css',
})
export class ConstellationLineControlsComponent {
  updateLine(line: any) {
    this.state.updateConstellationLine(line as Partial<ConstellationLineSettings>);
  }
  private state = inject(SkyMapStateService);
  constellationLineSettings$ = this.state.constellationLineSettings$;

  update<K extends keyof ConstellationLineSettings>(key: K, value: ConstellationLineSettings[K]) {
    this.state.updateConstellationLine({ [key]: value } as Partial<ConstellationLineSettings>);
  }
}
