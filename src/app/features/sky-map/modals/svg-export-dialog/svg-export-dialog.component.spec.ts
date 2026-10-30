import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgExportDialogComponent } from './svg-export-dialog.component';

describe('SvgExportDialogComponent', () => {
  let component: SvgExportDialogComponent;
  let fixture: ComponentFixture<SvgExportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgExportDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgExportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
