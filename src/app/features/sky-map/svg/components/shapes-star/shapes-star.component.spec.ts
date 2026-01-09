import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapesStarComponent } from './shapes-star.component';

describe('ShapesStarComponent', () => {
  let component: ShapesStarComponent;
  let fixture: ComponentFixture<ShapesStarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShapesStarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShapesStarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
