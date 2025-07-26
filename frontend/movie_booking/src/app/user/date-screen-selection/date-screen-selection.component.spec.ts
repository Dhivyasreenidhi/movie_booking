import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateScreenSelectionComponent } from './date-screen-selection.component';

describe('DateScreenSelectionComponent', () => {
  let component: DateScreenSelectionComponent;
  let fixture: ComponentFixture<DateScreenSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateScreenSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateScreenSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
