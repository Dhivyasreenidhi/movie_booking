import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditOfferDialogComponent } from './add-edit-offer-dialog.component';

describe('AddEditOfferDialogComponent', () => {
  let component: AddEditOfferDialogComponent;
  let fixture: ComponentFixture<AddEditOfferDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditOfferDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditOfferDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
