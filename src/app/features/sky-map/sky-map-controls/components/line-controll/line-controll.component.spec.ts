import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineControllComponent } from './line-controll.component';

describe('LineControllComponent', () => {
  let component: LineControllComponent;
  let fixture: ComponentFixture<LineControllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineControllComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LineControllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
