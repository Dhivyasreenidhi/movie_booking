import { Component } from '@angular/core';
import { RouterOutlet,Route } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { BannersComponent } from './components/banners/banners.component';
import { FiltersComponent } from './components/filters/filters.component';
import { NowStreamingComponent } from './components/now-streaming/now-streaming.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { TrailersComponent } from './components/trailers/trailers.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './login/login.component';
import { SignUpEmailComponent } from './sign-up-email/sign-up-email.component';
import { SignUpPhoneComponent } from './sign-up-phone/sign-up-phone.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/homepage/homepage.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,LoginComponent,SignUpEmailComponent,SignUpPhoneComponent, HeaderComponent,FiltersComponent,NowStreamingComponent,ComingSoonComponent,HomeComponent,TrailersComponent,FooterComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'movie_booking';
}
