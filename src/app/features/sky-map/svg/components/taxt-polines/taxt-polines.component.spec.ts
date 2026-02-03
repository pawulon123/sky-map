import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxtPolinesComponent } from './taxt-polines.component';

describe('TaxtPolinesComponent', () => {
  let component: TaxtPolinesComponent;
  let fixture: ComponentFixture<TaxtPolinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxtPolinesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaxtPolinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
