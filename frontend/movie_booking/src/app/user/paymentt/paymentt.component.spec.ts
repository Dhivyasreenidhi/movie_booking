import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymenttComponent } from './paymentt.component';

describe('PaymenttComponent', () => {
  let component: PaymenttComponent;
  let fixture: ComponentFixture<PaymenttComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymenttComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymenttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
