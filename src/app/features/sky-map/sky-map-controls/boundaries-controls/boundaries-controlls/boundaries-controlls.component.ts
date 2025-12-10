import { Component } from '@angular/core';
import { LabelBoundariesControllsComponent } from '../label-boundaries-controlls/label-boundaries-controlls.component';
import { BoundaryLinesControlsComponent } from '../lines-boundaries-controlls/lines-boundaries-controlls.component';
import { MatTabGroup, MatTab } from '@angular/material/tabs';

@Component({
  selector: 'app-boundaries-controls',
  imports: [LabelBoundariesControllsComponent, BoundaryLinesControlsComponent, MatTabGroup, MatTab],
  templateUrl: './boundaries-controlls.component.html',
  styleUrls: ['./boundaries-controlls.component.css'],
})
export class BoundariesControllsComponent {}
