import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpacityInputComponent } from './opacity-input.component';

describe('OpacityInputComponent', () => {
  let component: OpacityInputComponent;
  let fixture: ComponentFixture<OpacityInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpacityInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OpacityInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
