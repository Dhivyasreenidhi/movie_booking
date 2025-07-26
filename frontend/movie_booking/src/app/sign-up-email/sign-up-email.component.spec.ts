import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpEmailComponent } from './sign-up-email.component';

describe('SignUpEmailComponent', () => {
  let component: SignUpEmailComponent;
  let fixture: ComponentFixture<SignUpEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
