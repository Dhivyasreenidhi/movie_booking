import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content-trailer',
  imports: [FormsModule,SidebarComponent,NavBarComponent],
  templateUrl: './content-trailer.component.html',
  styleUrl: './content-trailer.component.css'
})
export class ContentTrailerComponent {
  activeTab: string = 'banner';
formData = {
    title: "KUBERAA Official Trailer",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "2:45",
    description: "Watch the high-octane official trailer for KUBERAA"
  };

  constructor(private sanitizer: DomSanitizer,private router: Router) {}
 

  get safeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.formData.youtubeUrl);
  }

  updateTrailer() {
    // Add your save/update logic here
    console.log('Updated trailer:', this.formData);
  }

  selectTab(tab: string) {
    this.activeTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/content-management']);
  }
}