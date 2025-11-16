import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyMapPageComponent } from './sky-map-page.component';

describe('SkyMapPageComponent', () => {
  let component: SkyMapPageComponent;
  let fixture: ComponentFixture<SkyMapPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkyMapPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkyMapPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
