import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NowStreamingsComponent } from './now-streamings.component';

describe('NowStreamingsComponent', () => {
  let component: NowStreamingsComponent;
  let fixture: ComponentFixture<NowStreamingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
  imports: [NowStreamingsComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

  fixture = TestBed.createComponent(NowStreamingsComponent);
  component = fixture.componentInstance;
  // Mock movies array to avoid undefined errors
  component.movies = [];
  // Mock MovieService if needed
  spyOn(component, 'ngOnInit').and.stub();
  fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
