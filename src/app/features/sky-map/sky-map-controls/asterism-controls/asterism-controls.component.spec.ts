import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsterismControlsComponent } from './asterism-controls.component';

describe('AsterismControlsComponent', () => {
  let component: AsterismControlsComponent;
  let fixture: ComponentFixture<AsterismControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsterismControlsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AsterismControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
