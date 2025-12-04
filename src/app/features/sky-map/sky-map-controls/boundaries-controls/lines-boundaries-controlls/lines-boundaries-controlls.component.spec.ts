import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinesBoundariesControllsComponent } from './lines-boundaries-controlls.component';

describe('LinesBoundariesControllsComponent', () => {
  let component: LinesBoundariesControllsComponent;
  let fixture: ComponentFixture<LinesBoundariesControllsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinesBoundariesControllsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LinesBoundariesControllsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
