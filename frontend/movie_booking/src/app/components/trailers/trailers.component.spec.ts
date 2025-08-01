import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TrailersComponent } from './trailers.component';

describe('TrailersComponent', () => {
  let component: TrailersComponent;
  let fixture: ComponentFixture<TrailersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrailersComponent],
      providers: [{ provide: ActivatedRoute, useValue: {} }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrailersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
