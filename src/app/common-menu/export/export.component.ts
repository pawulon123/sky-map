import { Component, inject, Input } from '@angular/core';
import { exportSvg } from './export-svg';
import { svgDataDefault } from '../../core/default/svg-data';
import { SvgData } from '../../core/common/svg-data';
import { log } from 'util';
import { SvgDataService } from '../../core/services/svg-data-ref.service';

@Component({
  selector: 'app-export',
  imports: [],
  templateUrl: './export.component.html',
  styleUrl: './export.component.css',
})
export class ExportComponent {
  svgDataService = inject(SvgDataService);
  @Input() dataFromSvg: SvgData = svgDataDefault;
  exportSvg() {
    exportSvg(this.dataFromSvg, this.svgDataService.getSvgNativeEl());
  }
}
