
// content-management.component.ts
import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { MatDialog } from '@angular/material/dialog';
import { EditContentDialogComponent } from '../dialogs/edit-content-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input'; // Optional for forms
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Optional for forms
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { ContentNowComponent } from '../content-now/content-now.component';
import { RouterModule } from '@angular/router';
import { ContentNavbarComponent } from '../content-navbar/content-navbar.component';

@Component({
  selector: 'app-content-management',
  templateUrl: './content-management.component.html',
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    MatTableModule,
    MatIconModule,
    MatInputModule,
    SidebarComponent,
    NavBarComponent,
    ContentNowComponent,RouterModule,
    ContentNavbarComponent

  ],
  styleUrls: ['./content-management.component.css']
})
export class ContentManagementComponent implements OnInit {
  banners: any[] = [];
  ngOnInit() {
    this.loadBanners();
  }

  loadBanners() {
    this.contentService.getBanner().subscribe(banners => {
      this.banners = banners || [];
    });
  }

  deleteBanner(id: number) {
    this.contentService.deleteBanner(id).subscribe({
      next: () => {
        this.banners = this.banners.filter(b => b.id !== id);
      },
      error: err => {
        alert('Error deleting banner: ' + (err?.error?.message || err.message));
      }
    });
  }
  saveSuccess = false;
  constructor(private contentService: ContentService) {}
  saveBanner() {
    const banner = {
      genre: this.form.genre,
      title: this.form.title,
      director: this.form.director,
      description: this.form.description,
      status: this.form.status,
      trailerUrl: this.form.trailerUrl,
      posterImage: this.form.posterImage,
      bannerImages: JSON.stringify(this.form.bannerImages.split(',').map(url => url.trim()).filter(Boolean))
    };
    this.contentService.postBanner(banner).subscribe({
      next: res => {
        // After saving banner, save details only if banner_id is valid
        const banner_id = res?.id;
        if (!banner_id) {
          alert('Error: Banner ID not returned from backend. Banner details not saved.');
          return;
        }
        const details = {
          banner_id,
          year: this.form.year,
          duration: this.form.duration,
          rating: this.form.rating,
          topCast: JSON.stringify(this.form.topCast.split(',').map(s => s.trim()).filter(Boolean)),
          storyLine: this.form.storyLine
        };
        this.contentService.postBannerDetails(details).subscribe({
          next: () => {
            this.saveSuccess = true;
            setTimeout(() => this.saveSuccess = false, 2000);
          },
          error: err => {
            alert('Error saving banner details: ' + (err?.error?.message || err.message || 'Unknown error'));
          }
        });
      },
      error: err => {
        alert('Error saving banner: ' + (err?.error?.message || err.message || 'Unknown error'));
      }
    });
  }
  activeTab: string = 'banner';
  
  // Banner data
  banner = {
      
    genre: 'ACTION MOVIE',
    title: 'KUBERAA',
    director: 'Sekhar Kammula',
    description: 'A high-octane action thriller that redefines the genre. Experience the revolution in Indian cinema.',
    status: 'NOW SHOWING',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    posterImage: 'https://static.toiimg.com/thumb/msid-113147270,width-1280,height-720,resizemode-4/113147270.jpg',
    bannerImages: [
      'https://static.toiimg.com/thumb/msid-113147270,width-1280,height-720,resizemode-4/113147270.jpg',
      'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/kuberaa-et00317024-1675064561.jpg',
      'https://static.toiimg.com/thumb/msid-113147270,width-1280,height-720,resizemode-4/113147270.jpg' // Added this URL
    ],
    currentBannerIndex: 0
  };

  // Form data
  form = {
    genre: this.banner.genre,
    title: this.banner.title,
    director: this.banner.director,
    description: this.banner.description,
    status: this.banner.status,
    trailerUrl: this.banner.trailerUrl,
    posterImage: this.banner.posterImage,
    bannerImages: this.banner.bannerImages.join(', '),
    year: '',
    duration: '',
    rating: '',
    topCast: '',
    storyLine: ''
  };

  updatePreview() {
    this.banner = {
      ...this.banner,
      genre: this.form.genre,
      title: this.form.title,
      director: this.form.director,
      description: this.form.description,
      status: this.form.status,
      trailerUrl: this.form.trailerUrl,
      posterImage: this.form.posterImage,
      bannerImages: this.form.bannerImages.split(',').map(url => url.trim()),
      // Optionally preview details fields if needed
    };
  }

  rotateBanner() {
    this.banner.currentBannerIndex = 
      (this.banner.currentBannerIndex + 1) % this.banner.bannerImages.length;
  }

  selectTab(tab: string) {
    this.activeTab = tab;
  }
}