import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelsConstalationComponent } from './panels-constalation.component';

describe('PanelsConstalationComponent', () => {
  let component: PanelsConstalationComponent;
  let fixture: ComponentFixture<PanelsConstalationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelsConstalationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelsConstalationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
