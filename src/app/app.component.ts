import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkyMapPageComponent } from './features/sky-map/sky-map-page/sky-map-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SkyMapPageComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
 
}
