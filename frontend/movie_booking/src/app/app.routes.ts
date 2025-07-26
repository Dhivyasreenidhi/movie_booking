import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { SignUpEmailComponent } from './sign-up-email/sign-up-email.component';
import { SignUpPhoneComponent } from './sign-up-phone/sign-up-phone.component';
import { NowStreamingComponent } from './components/now-streaming/now-streaming.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { TrailersComponent } from './components/trailers/trailers.component';
import { BannersComponent } from './components/banners/banners.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { MovieManagementComponent } from './components/manage-movies/manage-movies.component';
import { AuthGuard } from './auth.guard'
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ManageShowtimesComponent } from './manage-showtimes/manage-showtimes.component';
import { ManageseatsComponent } from './components/manageseats/manageseats.component';
import { ManageEmployeesComponent } from './components/manage-employees/manage-employees.component';
import { ManageOffersComponent } from './components/manage-offers/manage-offers.component';
import { ContentManagementComponent } from './components/content-management/content-management.component';
import { ContentNowComponent } from './components/content-now/content-now.component';
import { ContentComingComponent } from './components/content-coming/content-coming.component';
import { ContentTrailerComponent } from './components/content-trailer/content-trailer.component';
import { ContentOfferComponent } from './components/content-offer/content-offer.component';



import { BannerComponent } from './user/banner/banner.component';
import { HeadersComponent } from './user/headers/headers.component';
import { NowStreamingsComponent } from './user/now-streamings/now-streamings.component';
import { ComingSoonsComponent } from './user/coming-soons/coming-soons.component';
import { TrailerComponent } from './user/trailer/trailer.component';
import { OfferComponent } from './user/offer/offer.component';
import { FootersComponent } from './user/footers/footers.component';
import { HomeComponent as UserHomeComponent } from './user/home/home.component';
import { MovieComponent } from './user/movie/movie.component';
import { HelpCenterComponent } from './components/help-center/help-center.component';
import { MovieHeaderComponent } from './user/movie-header/movie-header.component';
import { MovieSynopsisComponent } from './user/movie-synopsis/movie-synopsis.component';
import { UserReviewsComponent } from './user/user-reviews/user-reviews.component';
import { LanguageThemeControlsComponent } from './user/language-theme-controls/language-theme-controls.component';
import { BookingStepsComponent } from './user/booking-steps/booking-steps.component';
import { DateScreenSelectionComponent } from './user/date-screen-selection/date-screen-selection.component';
import { ShowtimeSelectionComponent } from './user/showtime-selection/showtime-selection.component';
import { SeatSelectionComponent } from './user/seat-selection/seat-selection.component';
import { OrderSummaryComponent } from './user/order-summary/order-summary.component';
import { PaymentFormComponent } from './user/payment-form/payment-form.component';
import { ConfirmationModalComponent } from './user/confirmation-modal/confirmation-modal.component';
import { SupportChatComponent } from './user/support-chat/support-chat.component';
import { FeedbackComponent } from './user/feedback/feedback.component';
import { FiltersComponent } from './components/filters/filters.component';
import { FeedbacksComponent } from './components/feedbacks/feedbacks.component';
import { MoviessComponent } from './components/moviess/moviess.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ProfileComponent } from './user/profile/profile.component';
import { BookingManagementComponent } from './user/booking-management/booking-management.component';
import { ShowtimeSelectionssComponent } from './user/showtime-selectionss/showtime-selectionss.component';
import { PaymentProcessComponent } from './user/payment-process/payment-process.component';


 
  




export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signupemail', component: SignUpEmailComponent },
  { path: 'signupphone', component: SignUpPhoneComponent },
  { path: 'now-streaming', component: NowStreamingComponent },
  { path: 'coming-soon', component: ComingSoonComponent },
  { path: 'trailers', component: TrailersComponent },
  { path: 'banners', component: BannersComponent },
  { path: 'about', component: HomeComponent },
  { path:'manage-movies',component:MovieManagementComponent},
  { path: 'admin-dashboard', component: AdminDashboardComponent,canActivate: [AuthGuard] },
  { path: 'sidebar', component: SidebarComponent},
  { path: 'navbar', component:NavBarComponent},
  { path: 'manage-show', component:ManageShowtimesComponent},
  { path: 'manage-show/:movieId', component: ManageShowtimesComponent },
  { path: 'seat-booking', component:ManageseatsComponent},
  { path: 'user-management', component:ManageEmployeesComponent},
  { path: 'offer-management', component:ManageOffersComponent },
  { path: 'content-management', component:ContentManagementComponent},
  { path: 'content-now', component:ContentNowComponent},
  { path: 'content-coming', component:ContentComingComponent},
  { path: 'content-trailer', component:ContentTrailerComponent},
  { path: 'content-offer', component:ContentOfferComponent},
  { path: 'help-center', component:HelpCenterComponent},
  { path: 'filter', component:FiltersComponent},
  { path: 'feedbacks', component:FeedbacksComponent},
  { path: 'moviess', component:MoviessComponent},
  { path: 'reports', component:ReportsComponent},




  
  { path: 'user-header', component:HeadersComponent},
  { path: 'user-banner', component:BannerComponent},
  { path: 'user-nowstreaming', component:NowStreamingsComponent},
  { path: 'user-comingsoon', component:ComingSoonsComponent},
  { path: 'user-trailer', component:TrailerComponent},
  { path: 'user-offer', component:OfferComponent},
  { path: 'user-footer', component:FootersComponent},
  { path: 'user-home', component:UserHomeComponent},
  { path: 'user-movie', component:MovieComponent},
  { path: 'user-movie-header', component:MovieHeaderComponent},
  { path: 'user-movie-synopsis', component:MovieSynopsisComponent},
  { path: 'user-reviews', component: UserReviewsComponent},
  { path: 'language', component:LanguageThemeControlsComponent},
  { path: 'booking-steps', component:BookingStepsComponent},
  { path: 'date', component:DateScreenSelectionComponent},
  { path: 'show-time', component:ShowtimeSelectionComponent},
  { path: 'seat-select', component:SeatSelectionComponent},
  { path: 'order-summary', component:OrderSummaryComponent},
  { path: 'payment', component: PaymentFormComponent},
  { path: 'confirmation', component:ConfirmationModalComponent},
  { path: 'support-chat', component: SupportChatComponent},
  { path: 'feedback', component:FeedbackComponent},
  { path: 'user-profile', component:ProfileComponent},
  { path: 'booking-management', component:BookingManagementComponent},
  { path: 'show', component:ShowtimeSelectionssComponent},
  { path: 'payment-process', component: PaymentProcessComponent}
  


  
];
