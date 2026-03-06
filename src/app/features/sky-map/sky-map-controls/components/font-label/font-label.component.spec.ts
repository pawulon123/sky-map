import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FontLabelComponent } from './font-label.component';

describe('FontLabelComponent', () => {
  let component: FontLabelComponent;
  let fixture: ComponentFixture<FontLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FontLabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FontLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
