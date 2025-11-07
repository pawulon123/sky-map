import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstellationLinesLayerComponent } from './constellation-lines-layer.component';

describe('ConstellationLinesLayerComponent', () => {
  let component: ConstellationLinesLayerComponent;
  let fixture: ComponentFixture<ConstellationLinesLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstellationLinesLayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConstellationLinesLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
