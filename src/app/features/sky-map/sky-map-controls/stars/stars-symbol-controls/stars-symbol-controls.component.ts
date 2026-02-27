import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkyMapStateService } from '../../../domain/services/sky-map-state/sky-map-state.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { StarsSymbolsSettings } from '../../../domain/models/stars-layer-settings.model';
import { HeaderPortalComponent } from '../../header-portal.component';
@Component({
  selector: 'app-stars-symbol-controls',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    HeaderPortalComponent,
  ],
  templateUrl: './stars-symbol-controls.component.html',
  styleUrls: ['./stars-symbol-controls.component.css'],
})
export class StarsSymbolControlsComponent {
  private state = inject(SkyMapStateService);
  starsSettings$ = this.state.starsLayerSettings$;

  update<K extends keyof StarsSymbolsSettings>(key: K, value: StarsSymbolsSettings[K]): void {
    this.state.updateStarsSymbols({ [key]: value });
  }
}
