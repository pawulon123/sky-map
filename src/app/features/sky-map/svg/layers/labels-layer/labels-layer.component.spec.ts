import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelsLayerComponent } from './labels-layer.component';

describe('LabelsLayerComponent', () => {
  let component: LabelsLayerComponent;
  let fixture: ComponentFixture<LabelsLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelsLayerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabelsLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
