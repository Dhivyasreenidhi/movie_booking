import { Component } from '@angular/core';
import { HeadersComponent } from '../headers/headers.component';
import { FootersComponent } from '../footers/footers.component';

@Component({
  selector: 'app-offer',
  imports: [HeadersComponent,FootersComponent],
  templateUrl: './offer.component.html',
  styleUrl: './offer.component.css'
})
export class OfferComponent {

}
