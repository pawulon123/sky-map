import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarsLabelControlsComponent } from './stars-label-controls.component';

describe('StarsLabelControlsComponent', () => {
  let component: StarsLabelControlsComponent;
  let fixture: ComponentFixture<StarsLabelControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarsLabelControlsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StarsLabelControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
