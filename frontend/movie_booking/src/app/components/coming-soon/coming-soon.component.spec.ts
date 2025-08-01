import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComingSoonComponent } from './coming-soon.component';
import { MovieService } from '../../services/movie.service';
import { of, throwError } from 'rxjs';

describe('ComingSoonComponent', () => {
  let component: ComingSoonComponent;
  let fixture: ComponentFixture<ComingSoonComponent>;
  let movieServiceSpy: any;

  beforeEach(async () => {
    movieServiceSpy = { getMovies: jasmine.createSpy('getMovies').and.returnValue(of([])) };
    await TestBed.configureTestingModule({
      imports: [ComingSoonComponent],
      providers: [
        { provide: MovieService, useValue: movieServiceSpy }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ComingSoonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movies on init', () => {
    expect(movieServiceSpy.getMovies).toHaveBeenCalled();
  });

  it('should open and close popup', () => {
    component.openMovieDetails({ title: 'Test Movie' });
    expect(component.showPopup).toBeTrue();
    component.closePopup();
    expect(component.showPopup).toBeFalse();
  });

  it('should handle movieService error', () => {
    movieServiceSpy.getMovies.and.returnValue(throwError(() => new Error('fail')));
    component.ngOnInit();
    expect(component.movies).toEqual([]);
  });
});
