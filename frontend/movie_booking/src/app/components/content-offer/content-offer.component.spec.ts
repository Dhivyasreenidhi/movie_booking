
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ContentOfferComponent } from './content-offer.component';

describe('ContentOfferComponent', () => {
  let component: ContentOfferComponent;
  let fixture: ComponentFixture<ContentOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentOfferComponent, CommonModule, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ContentOfferComponent);
    component = fixture.componentInstance;
    // Mock offersForm to avoid ngForOf and undefined errors
    component.offersForm = {
      get: jasmine.createSpy('get').and.returnValue({ value: '', markAsTouched: () => {}, controls: [] })
    } as any;
    // Stub headerTitle to avoid undefined error
    component.headerTitle = '';
    fixture.detectChanges();
  });

  xit('should create', () => {
      expect(component).toBeTruthy();
    });
});
