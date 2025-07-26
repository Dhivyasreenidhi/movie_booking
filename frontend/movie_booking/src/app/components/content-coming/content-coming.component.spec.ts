import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentComingComponent } from './content-coming.component';

describe('ContentComingComponent', () => {
  let component: ContentComingComponent;
  let fixture: ComponentFixture<ContentComingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentComingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentComingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
