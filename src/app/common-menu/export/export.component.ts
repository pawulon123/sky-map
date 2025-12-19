import { Component, Input } from '@angular/core';
import { exportSvg } from './export-svg';
import { svgDataDefault } from '../../core/default/svg-data';
import { SvgData } from '../../core/common/svg-data';
import { log } from 'util';

@Component({
  selector: 'app-export',
  imports: [],
  templateUrl: './export.component.html',
  styleUrl: './export.component.css',
})
export class ExportComponent {
  @Input() dataFromSvg: SvgData = svgDataDefault;
  exportSvg() {
    console.log(this.dataFromSvg);

    exportSvg(this.dataFromSvg);
  }
}
