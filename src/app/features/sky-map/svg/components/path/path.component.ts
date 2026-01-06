import { Component, Input } from '@angular/core';

@Component({
  selector: 'g[app-svg-path]',
  imports: [],
  templateUrl: './path.component.html',
  styleUrl: './path.component.css'
})
export class PathComponent {
  @Input() points = ''
  @Input() settings : any

}
