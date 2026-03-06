import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PolilineText } from '../../../domain/models/svg-general';
import { FontSVG } from '../../../domain/models/font';

@Component({
  selector: 'g[app-taxt-polines]',
  imports: [CommonModule],
  templateUrl: './text-polines.component.html',
  styleUrl: './text-polines.component.css',
})
export class TaxtPolinesComponent {
  @Input() settings!: FontSVG;
  @Input() lines: PolilineText[] = [];
}
