import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { HeadersComponent } from '../../user/headers/headers.component';
import { BannersComponent } from '../banners/banners.component';
import { FiltersComponent } from '../filters/filters.component';
import { NowStreamingComponent } from '../now-streaming/now-streaming.component';
import { ComingSoonComponent } from '../coming-soon/coming-soon.component';
import { TrailersComponent } from '../trailers/trailers.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { OfferComponent } from '../../user/offer/offer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeadersComponent,
    BannersComponent,
    NowStreamingComponent,
    TrailersComponent,
    FiltersComponent,
    FooterComponent,FiltersComponent,ComingSoonComponent,OfferComponent
  ],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomeComponent {
  isLoggedIn: boolean = false;
  constructor() {
    const authData = localStorage.getItem('kgCinemasAuth');
    if (authData) {
      const parsed = JSON.parse(authData);
      this.isLoggedIn = parsed.isLoggedIn === true;
    }
  }
}
