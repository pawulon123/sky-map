import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarsSymbolControlsComponent } from './stars-symbol-controls.component';

describe('StarsSymbolControlsComponent', () => {
  let component: StarsSymbolControlsComponent;
  let fixture: ComponentFixture<StarsSymbolControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarsSymbolControlsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StarsSymbolControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
