import { Component } from '@angular/core';
import { LabelBoundariesControllsComponent } from '../label-boundaries-controlls/label-boundaries-controlls.component';
import { LinesBoundariesControllsComponent } from '../lines-boundaries-controlls/lines-boundaries-controlls.component';
import { MatTabGroup, MatTab } from '@angular/material/tabs';

@Component({
  selector: 'app-boundaries-controls',
  imports: [LabelBoundariesControllsComponent, LinesBoundariesControllsComponent, MatTabGroup, MatTab],
  templateUrl: './boundaries-controlls.component.html',
  styleUrls: ['./boundaries-controlls.component.css'],
})
export class BoundariesControllsComponent {}
