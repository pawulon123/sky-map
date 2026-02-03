import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'g[app-taxt-polines]',
  imports: [CommonModule],
  templateUrl: './taxt-polines.component.html',
  styleUrl: './taxt-polines.component.css',
})
export class TaxtPolinesComponent implements OnInit {
  ngOnInit(): void {
    // console.log(this.lines,this.settings);
  }
  @Input() settings: any;
  @Input() lines: any;
}
