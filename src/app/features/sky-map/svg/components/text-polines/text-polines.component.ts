import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PolilineText, SettingsPolilineText } from '../../../domain/models/svg-general';


@Component({
  selector: 'g[app-taxt-polines]',
  imports: [CommonModule],
  templateUrl: './text-polines.component.html',
  styleUrl: './text-polines.component.css',
})
export class TaxtPolinesComponent  {

  @Input() settings!: SettingsPolilineText
  @Input() lines: PolilineText[] = [];
}
