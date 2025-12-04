import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelBoundariesLayerComponent } from './label-boundaries-layer.component';

describe('LabelBoundariesLayerComponent', () => {
  let component: LabelBoundariesLayerComponent;
  let fixture: ComponentFixture<LabelBoundariesLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelBoundariesLayerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabelBoundariesLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
