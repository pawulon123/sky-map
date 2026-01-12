import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelsProjectionControlsComponent } from './panels-projection-controls.component';

describe('PanelsProjectionControlsComponent', () => {
  let component: PanelsProjectionControlsComponent;
  let fixture: ComponentFixture<PanelsProjectionControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelsProjectionControlsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelsProjectionControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
