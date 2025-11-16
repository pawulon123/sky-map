import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoundariesControlsComponent } from './boundaries-controls.component';

describe('BoundariesControlsComponent', () => {
  let component: BoundariesControlsComponent;
  let fixture: ComponentFixture<BoundariesControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoundariesControlsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoundariesControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
