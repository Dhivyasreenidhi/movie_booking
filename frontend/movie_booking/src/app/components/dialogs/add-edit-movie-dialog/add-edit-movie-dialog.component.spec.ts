import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMovieDialogComponent } from './add-edit-movie-dialog.component';

describe('AddEditMovieDialogComponent', () => {
  let component: AddEditMovieDialogComponent;
  let fixture: ComponentFixture<AddEditMovieDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditMovieDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditMovieDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
