import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelBoundariesControllsComponent } from './label-boundaries-controlls.component';

describe('LabelBoundariesControllsComponent', () => {
  let component: LabelBoundariesControllsComponent;
  let fixture: ComponentFixture<LabelBoundariesControllsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelBoundariesControllsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabelBoundariesControllsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
