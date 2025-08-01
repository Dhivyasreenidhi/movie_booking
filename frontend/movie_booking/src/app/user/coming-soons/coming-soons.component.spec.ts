import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ComingSoonsComponent } from './coming-soons.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ComingSoonsComponent', () => {
  let component: ComingSoonsComponent;
  let fixture: ComponentFixture<ComingSoonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
  imports: [HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ComingSoonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
