import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarsLayerComponent } from './stars-layer.component';

describe('StarsLayerComponent', () => {
  let component: StarsLayerComponent;
  let fixture: ComponentFixture<StarsLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarsLayerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StarsLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
