import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ContentTrailerComponent } from './content-trailer.component';

describe('ContentTrailerComponent', () => {
  let component: ContentTrailerComponent;
  let fixture: ComponentFixture<ContentTrailerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentTrailerComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContentTrailerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
