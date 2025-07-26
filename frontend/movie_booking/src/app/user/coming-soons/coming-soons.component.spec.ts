import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComingSoonsComponent } from './coming-soons.component';

describe('ComingSoonsComponent', () => {
  let component: ComingSoonsComponent;
  let fixture: ComponentFixture<ComingSoonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComingSoonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComingSoonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
