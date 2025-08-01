import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ManageOffersComponent } from './manage-offers.component';

describe('ManageOffersComponent', () => {
  let component: ManageOffersComponent;
  let fixture: ComponentFixture<ManageOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageOffersComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
