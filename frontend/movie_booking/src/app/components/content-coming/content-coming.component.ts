import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content-coming',
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    NavBarComponent
  ],
  templateUrl: './content-coming.component.html',
  styleUrl: './content-coming.component.css'
})
export class ContentComingComponent {
  constructor(private router: Router) {}
  activeTab: string = 'banner';
formData = {
    title: "KUBERAA",
    releaseDate: "2023-12-15",
    description: "A high-octane action thriller that redefines the genre.",
    image: "https://static.toiimg.com/thumb/msid-113147270,width-1280,height-720,resizemode-4/113147270.jpg"
  };

  updateMovie() {
    // Add your save/update logic here
    console.log('Updated movie:', this.formData);
  }

  selectTab(tab: string) {
    this.activeTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/content-management']);
  }

}
