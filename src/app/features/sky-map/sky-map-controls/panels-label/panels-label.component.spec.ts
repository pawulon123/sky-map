import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelsLabelComponent } from './panels-label.component';

describe('PanelsLabelComponent', () => {
  let component: PanelsLabelComponent;
  let fixture: ComponentFixture<PanelsLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelsLabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelsLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
