import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyMapComponent } from './sky-map.component';

describe('SkyMapComponent', () => {
  let component: SkyMapComponent;
  let fixture: ComponentFixture<SkyMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkyMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkyMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
