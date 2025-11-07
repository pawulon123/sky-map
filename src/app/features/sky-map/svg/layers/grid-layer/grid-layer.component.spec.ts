import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridLayerComponent } from './grid-layer.component';

describe('GridLayerComponent', () => {
  let component: GridLayerComponent;
  let fixture: ComponentFixture<GridLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridLayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
