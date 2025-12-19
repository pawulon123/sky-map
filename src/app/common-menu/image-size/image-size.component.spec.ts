import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSizeComponent } from './image-size.component';

describe('ImageSizeComponent', () => {
  let component: ImageSizeComponent;
  let fixture: ComponentFixture<ImageSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageSizeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
