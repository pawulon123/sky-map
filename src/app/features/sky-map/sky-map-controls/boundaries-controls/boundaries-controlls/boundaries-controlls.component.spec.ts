import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoundariesControllsComponent } from './boundaries-controlls.component';

describe('BoundariesControllsComponent', () => {
  let component: BoundariesControllsComponent;
  let fixture: ComponentFixture<BoundariesControllsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoundariesControllsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoundariesControllsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
