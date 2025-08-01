import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OfferService } from './offer.service';

describe('OfferService', () => {
  let service: OfferService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      service = TestBed.inject(OfferService);
    });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
