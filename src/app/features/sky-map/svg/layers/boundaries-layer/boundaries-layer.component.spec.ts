import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoundariesLayerComponent } from './boundaries-layer.component';

describe('BoundariesLayerComponent', () => {
  let component: BoundariesLayerComponent;
  let fixture: ComponentFixture<BoundariesLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoundariesLayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoundariesLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
