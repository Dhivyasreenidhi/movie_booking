import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowtimeSelectionssComponent } from './showtime-selectionss.component';

describe('ShowtimeSelectionssComponent', () => {
  let component: ShowtimeSelectionssComponent;
  let fixture: ComponentFixture<ShowtimeSelectionssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowtimeSelectionssComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowtimeSelectionssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
