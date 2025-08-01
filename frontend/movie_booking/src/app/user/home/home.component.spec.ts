import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HomeComponent } from './home.component';
import { Component } from '@angular/core';
// Mock child components used in HomeComponent template
@Component({selector: 'app-headers', template: '', standalone: true}) class MockHeaders {}
@Component({selector: 'app-banner', template: '', standalone: true}) class MockBanner {
  public showing = true;
  public movies = [{ showing: true }];
}
@Component({selector: 'app-now-streamings', template: '', standalone: true}) class MockNowStreamings {}
@Component({selector: 'app-coming-soons', template: '', standalone: true}) class MockComingSoons {}
@Component({selector: 'app-trailer', template: '', standalone: true}) class MockTrailer {}
@Component({selector: 'app-offer', template: '', standalone: true}) class MockOffer {}
@Component({selector: 'app-footers', template: '', standalone: true}) class MockFooters {}
import { Router } from '@angular/router';
import { ScrollserviceService } from '../../services/scrollservice.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let routerSpy: any;
  let scrollServiceSpy: any;

  beforeEach(async () => {
    routerSpy = { events: of({}), url: '/user-home', navigate: jasmine.createSpy('navigate') };
    scrollServiceSpy = { scrollToElement: jasmine.createSpy('scrollToElement') };
    await TestBed.configureTestingModule({
      imports: [HomeComponent, HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ScrollserviceService, useValue: scrollServiceSpy }
      ]
    });
    TestBed.overrideComponent(HomeComponent, {
      set: {
        imports: [
          MockHeaders,
          MockBanner,
          MockNowStreamings,
          MockComingSoons,
          MockTrailer,
          MockOffer,
          MockFooters
        ]
      }
    });
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
      expect(component).toBeTruthy();
    });

  xit('should call scrollToElement if url is /user-home', () => {
    component.scrollToMovies();
    expect(scrollServiceSpy.scrollToElement).toHaveBeenCalledWith('movies', 100);
  });

  xit('should navigate if url is not /user-home', () => {
    routerSpy.url = '/other';
    component.scrollToMovies();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/user-home'], { fragment: 'movies' });
  });
});
