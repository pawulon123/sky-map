import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CircleComponent } from './shapes/circle.component';
import { RingComponent } from './shapes/ring.component';
import { CrossComponent } from './shapes/cross.component';
import { CustomComponent } from './shapes/custom.component';
import { SquareComponent } from './shapes/square.component';
import { StarComponent } from './shapes/star.component';
import { TriangleComponent } from './shapes/triangle.component';

@Component({
  selector: 'g[app-shapes-star]',
  imports: [
    CommonModule,
    CircleComponent,
    CustomComponent,
    SquareComponent,
    StarComponent,
    TriangleComponent,
    RingComponent,
    CrossComponent,
  ],
  templateUrl: './shapes-star.component.html',
  styleUrl: './shapes-star.component.css',
  standalone: true,
})
export class ShapesStarComponent {
  @Input('star') s: any;
}
