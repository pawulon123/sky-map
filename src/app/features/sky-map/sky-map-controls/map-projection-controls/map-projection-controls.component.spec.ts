import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapProjectionControlsComponent } from './map-projection-controls.component';

describe('MapProjectionControlsComponent', () => {
  let component: MapProjectionControlsComponent;
  let fixture: ComponentFixture<MapProjectionControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapProjectionControlsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapProjectionControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
