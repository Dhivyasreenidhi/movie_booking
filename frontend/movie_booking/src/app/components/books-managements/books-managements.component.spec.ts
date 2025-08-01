import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BooksManagementsComponent } from './books-managements.component';

describe('BooksManagementsComponent', () => {
  let component: BooksManagementsComponent;
  let fixture: ComponentFixture<BooksManagementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksManagementsComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BooksManagementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
