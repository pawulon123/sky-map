import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';


export type ExportFormat = 'svg' | 'dxf';

export interface SvgExportOptions {
  truncateMm: boolean;
}

export interface SvgExportResult {
  format: ExportFormat;
  options: SvgExportOptions;
}
@Component({
  selector: 'app-svg-export-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  templateUrl: './svg-export-dialog.component.html',
})
export class SvgExportDialogComponent {
  private readonly dialogRef = inject(
    MatDialogRef<SvgExportDialogComponent, SvgExportOptions>
  );

  options: SvgExportOptions = {
    truncateMm: false,
  };

cancel(): void {
  this.dialogRef.close();
}

export(format: ExportFormat): void {
  this.dialogRef.close({
    format,
    options: { ...this.options }
  } satisfies SvgExportResult); 
}
}