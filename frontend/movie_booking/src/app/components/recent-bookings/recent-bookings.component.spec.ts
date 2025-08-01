import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RecentBookingsComponent } from './recent-bookings.component';

describe('RecentBookingsComponent', () => {
  let component: RecentBookingsComponent;
  let fixture: ComponentFixture<RecentBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentBookingsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecentBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
