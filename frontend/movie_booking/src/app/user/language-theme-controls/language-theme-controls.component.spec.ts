import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageThemeControlsComponent } from './language-theme-controls.component';

describe('LanguageThemeControlsComponent', () => {
  let component: LanguageThemeControlsComponent;
  let fixture: ComponentFixture<LanguageThemeControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageThemeControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageThemeControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
