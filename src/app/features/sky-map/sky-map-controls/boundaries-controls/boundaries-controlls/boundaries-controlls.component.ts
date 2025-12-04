import { Component } from '@angular/core';
import { LabelBoundariesControllsComponent } from '../label-boundaries-controlls/label-boundaries-controlls.component';
import { LinesBoundariesControllsComponent } from '../lines-boundaries-controlls/lines-boundaries-controlls.component';

@Component({
  selector: 'app-boundaries-controls',
  imports: [LabelBoundariesControllsComponent, LinesBoundariesControllsComponent],
  templateUrl: './boundaries-controlls.component.html',
})
export class BoundariesControllsComponent {}
