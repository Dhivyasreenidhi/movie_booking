import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageseatsComponent } from './manageseats.component';

describe('ManageseatsComponent', () => {
  let component: ManageseatsComponent;
  let fixture: ComponentFixture<ManageseatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageseatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageseatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
