import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyMapLayerStarsControlsComponent } from './sky-map-layer-stars-controls.component';

describe('SkyMapLayerStarsControlsComponent', () => {
  let component: SkyMapLayerStarsControlsComponent;
  let fixture: ComponentFixture<SkyMapLayerStarsControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkyMapLayerStarsControlsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkyMapLayerStarsControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
