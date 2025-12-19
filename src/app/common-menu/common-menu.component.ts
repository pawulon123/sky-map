import { Component, computed, effect, EventEmitter, inject, Input, Output } from '@angular/core';
import { ImageSizeComponent } from './image-size/image-size.component';
import { ExportComponent } from './export/export.component';
import { CommonMenuService } from './common-menu.service';

@Component({
  selector: 'app-common-menu',
  imports: [ImageSizeComponent, ExportComponent],
  templateUrl: './common-menu.component.html',
  standalone: true,
  styleUrl: './common-menu.component.css',
})
export class CommonMenuComponent {
  readonly svc = inject(CommonMenuService);

  @Input() dataFromSvg: any;
  @Output() eventFromCommonMenu = new EventEmitter<any>();

  ev = effect(() => {
    const ev = this.svc.ev();
    this.eventFromCommonMenu.emit(ev);
  });
}
