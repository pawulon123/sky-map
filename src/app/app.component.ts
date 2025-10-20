import { Component } from '@angular/core';
import { SkyMapComponent } from "./sky-map/sky-map.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [SkyMapComponent, CommonModule]
})
export class AppComponent {
  title = 'sky-map';
}
