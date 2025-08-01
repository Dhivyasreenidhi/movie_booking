import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { NowStreamingComponent } from './now-streaming.component';

describe('NowStreamingComponent', () => {
  let component: NowStreamingComponent;
  let fixture: ComponentFixture<NowStreamingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NowStreamingComponent],
      providers: [{ provide: ActivatedRoute, useValue: {} }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NowStreamingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
