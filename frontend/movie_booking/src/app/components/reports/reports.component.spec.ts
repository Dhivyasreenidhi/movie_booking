
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { FormGroup, FormControl } from '@angular/forms';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    // Mock reportForm for required controls
    component.reportForm = new FormGroup({
      reportType: new FormControl(''),
      chartType: new FormControl(''),
      datePreset: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      movie: new FormControl('')
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
