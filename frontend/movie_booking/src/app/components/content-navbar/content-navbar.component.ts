import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContentComingComponent } from '../content-coming/content-coming.component';
import { ContentNowComponent } from '../content-now/content-now.component';
import { ContentOfferComponent } from '../content-offer/content-offer.component';
import { ContentTrailerComponent } from '../content-trailer/content-trailer.component';

@Component({
  selector: 'app-content-navbar',
  standalone: true,
  imports: [
    RouterModule,
    ContentComingComponent,
    ContentOfferComponent,
    ContentTrailerComponent,
    ContentNavbarComponent
  ],
  templateUrl: './content-navbar.component.html',
  styleUrls: ['./content-navbar.component.css']
})
export class ContentNavbarComponent {
  activeTab: string = 'banner';

  selectTab(tab: string) {
    this.activeTab = tab;
  }
}
