import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftDateButtonsComponent } from './shift-date-buttons.component';

describe('ShiftDateButtonsComponent', () => {
  let component: ShiftDateButtonsComponent;
  let fixture: ComponentFixture<ShiftDateButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftDateButtonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftDateButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
