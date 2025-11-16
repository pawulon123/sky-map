import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstellationLineControlsComponent } from './constellation-line-controls.component';

describe('ConstellationLineControlsComponent', () => {
  let component: ConstellationLineControlsComponent;
  let fixture: ComponentFixture<ConstellationLineControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstellationLineControlsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConstellationLineControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
