import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColisionLabelComponent } from './colision-label.component';

describe('ColisionLabelComponent', () => {
  let component: ColisionLabelComponent;
  let fixture: ComponentFixture<ColisionLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColisionLabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ColisionLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
