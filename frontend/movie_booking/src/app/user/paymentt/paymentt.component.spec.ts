import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PaymenttComponent } from './paymentt.component';
describe('PaymenttComponent', () => {
  let component: PaymenttComponent;
  let fixture: ComponentFixture<PaymenttComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymenttComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParams: { subscribe: () => {} } } }
      ]
    }).compileComponents();

  fixture = TestBed.createComponent(PaymenttComponent);
  component = fixture.componentInstance;
  // Mock properties to avoid undefined errors
  component.selectedSeats = [];
  component.ticketPrice = 0;
  component.offers = [];
  component.movieTitle = '';
  component.showtime = '';
  component.theater = '';
  component.activeOffer = '';
  component.discount = 0;
  component.userEmailOrPhone = '';
  // Mock payment icons asset URLs
  component.paymentIcons = [
    'assets/visa.png',
    'assets/mastercard.png',
    'assets/paypal.png',
    'assets/apple-pay.png'
  ];
  // Mock HttpClient requests
  const httpMock = TestBed.inject(HttpTestingController);
  httpMock.match(() => true).forEach((req: any) => req.flush([]));
  // Stub fetchOffers, fetchMovieDetails, fetchShowtimeDetails to avoid subscribe error
  spyOn(component, 'fetchOffers').and.stub();
  spyOn(component, 'fetchMovieDetails').and.stub();
  spyOn(component, 'fetchShowtimeDetails').and.stub();
  fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

