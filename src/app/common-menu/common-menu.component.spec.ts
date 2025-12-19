import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonMenuComponent } from './common-menu.component';

describe('CommonMenuComponent', () => {
  let component: CommonMenuComponent;
  let fixture: ComponentFixture<CommonMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommonMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
