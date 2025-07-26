import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router';
import { BannerComponent } from '../banner/banner.component';
import { HeadersComponent } from '../headers/headers.component';
import { NowStreamingsComponent } from '../now-streamings/now-streamings.component';
import { ComingSoonsComponent } from '../coming-soons/coming-soons.component';
import { TrailerComponent } from '../trailer/trailer.component';
import { OfferComponent } from '../offer/offer.component';
import { FootersComponent } from '../footers/footers.component';
import { Router } from '@angular/router';
import { ScrollserviceService } from '../../services/scrollservice.service';
import { filter } from 'rxjs/operators';
import { NavigationEnd } from '@angular/router';  // Add this import


@Component({
  selector: 'app-home',
  imports: [BannerComponent, CommonModule, FormsModule, RouterModule,
    HeadersComponent,NowStreamingsComponent,ComingSoonsComponent,TrailerComponent,OfferComponent,FootersComponent
   
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
constructor(private router: Router, private scrollService: ScrollserviceService) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.router.url.includes('#movies')) {
        setTimeout(() => {
          this.scrollService.scrollToElement('movies', 100); // 100px offset
        }, 100);
      }
    });
  }

  // For direct clicks from the same page
  scrollToMovies() {
    if (this.router.url === '/user-home') {
      this.scrollService.scrollToElement('movies', 100);
    } else {
      this.router.navigate(['/user-home'], { fragment: 'movies' });
    }
  }
}

