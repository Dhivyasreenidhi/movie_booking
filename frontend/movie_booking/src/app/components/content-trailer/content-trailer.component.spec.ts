import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentTrailerComponent } from './content-trailer.component';

describe('ContentTrailerComponent', () => {
  let component: ContentTrailerComponent;
  let fixture: ComponentFixture<ContentTrailerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentTrailerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentTrailerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
