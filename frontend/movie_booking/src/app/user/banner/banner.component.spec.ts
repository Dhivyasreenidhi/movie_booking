import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BannerComponent } from './banner.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ContentService } from '../../services/content.service';
class MockContentService {
  getBanner() {
    return of([
      { posterUrl: 'assets/test-poster.png', title: 'Test Movie', posterImage: 'assets/test-poster.png' }
    ]);
  }
}

describe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerComponent, HttpClientTestingModule],
      providers: [
  { provide: ActivatedRoute, useValue: {} },
  { provide: ContentService, useClass: MockContentService }
      ]
    })
    .compileComponents();

  fixture = TestBed.createComponent(BannerComponent);
  component = fixture.componentInstance;
  // Mock movies array with posterUrl property
  component.movies = [
    { posterUrl: 'assets/test-poster.png', title: 'Test Movie', posterImage: 'assets/test-poster.png' }
  ];
  fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
