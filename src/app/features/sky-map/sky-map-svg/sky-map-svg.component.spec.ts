import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyMapSvgComponent } from './sky-map-svg.component';

describe('SkyMapSvgComponent', () => {
  let component: SkyMapSvgComponent;
  let fixture: ComponentFixture<SkyMapSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkyMapSvgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkyMapSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
