import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelPanelsComponent } from './label-panels.component';

describe('LabelPanelsComponent', () => {
  let component: LabelPanelsComponent;
  let fixture: ComponentFixture<LabelPanelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelPanelsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabelPanelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
