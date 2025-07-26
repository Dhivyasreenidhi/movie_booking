import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-language-theme-controls',
  imports: [CommonModule, FormsModule, ReactiveFormsModule], // Add FormsModule
  templateUrl: './language-theme-controls.component.html',
  styleUrls: ['./language-theme-controls.component.css']
})
export class LanguageThemeControlsComponent {
  @Input() isLightTheme: boolean = false;
  @Output() themeToggled = new EventEmitter<void>();
  
  languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'ja', label: 'Japanese' }
  ];
  
  subtitles = [
    { value: 'none', label: 'None' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' }
  ];
  
  selectedLanguage = 'en';
  selectedSubtitle = 'none';
  showAccessibilityMenu = false;
  highContrastMode = false;
  dyslexiaMode = false;

  toggleAccessibilityMenu(): void {
    this.showAccessibilityMenu = !this.showAccessibilityMenu;
  }

  toggleHighContrast(): void {
    this.highContrastMode = !this.highContrastMode;
    // Implement high contrast mode logic
  }

  toggleDyslexiaMode(): void {
    this.dyslexiaMode = !this.dyslexiaMode;
    // Implement dyslexia-friendly font logic
  }

  changeLanguage(): void {
    // Implement language change logic
  }

  onThemeToggle(): void {
    this.themeToggled.emit();
  }

  decreaseFontSize(): void {
    // Implement font size decrease
  }

  resetFontSize(): void {
    // Implement font size reset
  }

  increaseFontSize(): void {
    // Implement font size increase
  }
}