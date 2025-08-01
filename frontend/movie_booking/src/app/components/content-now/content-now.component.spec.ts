import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ContentNowComponent } from './content-now.component';

describe('ContentNowComponent', () => {
  let component: ContentNowComponent;
  let fixture: ComponentFixture<ContentNowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentNowComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContentNowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
