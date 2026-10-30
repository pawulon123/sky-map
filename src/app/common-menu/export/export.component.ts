
import { Component, inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { exportSvg } from './export-svg';
import { DxfExportService } from './dxf-export.service';

import { svgDataDefault } from '../../core/default/svg-data';
import { SvgData } from '../../core/common/svg-data';
import { SvgDataService } from '../../core/services/svg-data-ref.service';

import {
  SvgExportDialogComponent,
  SvgExportResult
} from '../../features/sky-map/modals/svg-export-dialog/svg-export-dialog.component';
import { svgToMm } from '../../core/utils/utils-function';

@Component({
  selector: 'app-export',
  imports: [],
  templateUrl: './export.component.html',
  styleUrl: './export.component.css',
})
export class ExportComponent {

  private readonly dialog = inject(MatDialog);

  private readonly dxfExportService = inject(DxfExportService);

  private readonly svgDataService = inject(SvgDataService);

  @Input() dataFromSvg: SvgData = svgDataDefault;

  openExportDialog(): void {

    const dialogRef = this.dialog.open<
      SvgExportDialogComponent,
      void,
      SvgExportResult
    >(SvgExportDialogComponent, {
      width: '450px',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {

      if (!result) return;

      const svgElement = this.svgDataService.getSvgNativeEl;

      if (!svgElement) {
        console.error('Nie znaleziono elementu SVG');
        return;
      }

      switch (result.format) {

        case 'svg':
          exportSvg(
            this.dataFromSvg,
            svgElement,
            result.options
          );






          break;

        case 'dxf':
          this.dxfExportService.exportDxf(
               this.svgDataService.getSvgNativeEl!,
    result.options,
    this.dataFromSvg.width,
    this.dataFromSvg.height

          );



          break;
      }

    });
  }
}
