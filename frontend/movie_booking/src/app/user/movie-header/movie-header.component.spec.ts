import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { MovieHeaderComponent } from './movie-header.component';

describe('MovieHeaderComponent', () => {
  let component: MovieHeaderComponent;
  let fixture: ComponentFixture<MovieHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieHeaderComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

  fixture = TestBed.createComponent(MovieHeaderComponent);
  component = fixture.componentInstance;
  component.movie = { posterUrl: '', title: '', genre: '', releaseDate: '', rating: '', description: '' };
  fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
