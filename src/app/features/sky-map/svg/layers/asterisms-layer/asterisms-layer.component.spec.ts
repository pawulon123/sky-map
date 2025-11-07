import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsterismsLayerComponent } from './asterisms-layer.component';

describe('AsterismsLayerComponent', () => {
  let component: AsterismsLayerComponent;
  let fixture: ComponentFixture<AsterismsLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsterismsLayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsterismsLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
