import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NowStreamingsComponent } from './now-streamings.component';

describe('NowStreamingsComponent', () => {
  let component: NowStreamingsComponent;
  let fixture: ComponentFixture<NowStreamingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NowStreamingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NowStreamingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
