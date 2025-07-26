import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  constructor(private http: HttpClient) {}

  getOffers() {
    return this.http.get<any[]>('/api/offers');
  }

  deleteOffer(id: number) {
    return this.http.delete(`/api/offers/${id}`);
  }

  postOffer(offer: any) {
    return this.http.post('/api/offers', offer);
  }
}
