import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootSvgComponent } from './root-svg.component';

describe('RootSvgComponent', () => {
  let component: RootSvgComponent;
  let fixture: ComponentFixture<RootSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RootSvgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RootSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
