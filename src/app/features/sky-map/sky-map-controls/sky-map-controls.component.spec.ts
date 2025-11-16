import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyMapControlsComponent } from './sky-map-controls.component';

describe('SkyMapControlsComponent', () => {
  let component: SkyMapControlsComponent;
  let fixture: ComponentFixture<SkyMapControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkyMapControlsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkyMapControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
