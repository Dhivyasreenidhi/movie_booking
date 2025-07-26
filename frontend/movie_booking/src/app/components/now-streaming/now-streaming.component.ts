// now-streaming.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

export interface Movie {
  title: string;
  language: string;
  image: string;
  rating: string;
  votes: string;
  link: string;
}

@Component({
  selector: 'app-now-streaming',
  standalone: true,
  imports: [CommonModule, RouterModule,HeaderComponent,FooterComponent],
  templateUrl: './now-streaming.component.html',
  styleUrls: ['./now-streaming.component.css']
})
export class NowStreamingComponent implements OnInit {
  movies: Movie[] = [
    {
      title: "VEERA DHEERA SOORAN",
      language: "Tamil",
      image: "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-24,ly-615,w-29,l-end:l-text,ie-OC40LzEwICAyNy44SyBWb3Rlcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00423507-bavrucgtpa-portrait.jpg",
      rating: "8.4/10",
      votes: "27.8K Votes",
      link: "login"
    },
    {
      title: "DRAGON",
      language: "Tamil",
      image: "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-10,ly-615,w-29,l-end:l-text,ie-OS4zLzEwICA2Ny41SyBWb3Rlcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00430623-gxyubexxhw-portrait.jpg",
      rating: "9.3/10",
      votes: "67.5K Votes",
      link: "login"
    },
    {
      title: "VEERA DHEERA SOORAN",
      language: "Tamil",
      image: "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-24,ly-615,w-29,l-end:l-text,ie-OC40LzEwICAyNy44SyBWb3Rlcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00423507-bavrucgtpa-portrait.jpg",
      rating: "8.4/10",
      votes: "27.8K Votes",
      link: "login"
    },
    {
      title: "DRAGON",
      language: "Tamil",
      image: "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-10,ly-615,w-29,l-end:l-text,ie-OS4zLzEwICA2Ny41SyBWb3Rlcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00430623-gxyubexxhw-portrait.jpg",
      rating: "9.3/10",
      votes: "67.5K Votes",
      link: "login"
    },
    {
      title: "VEERA DHEERA SOORAN",
      language: "Tamil",
      image: "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-24,ly-615,w-29,l-end:l-text,ie-OC40LzEwICAyNy44SyBWb3Rlcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00423507-bavrucgtpa-portrait.jpg",
      rating: "8.4/10",
      votes: "27.8K Votes",
      link: "login"
    },
    {
      title: "DRAGON",
      language: "Tamil",
      image: "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-10,ly-615,w-29,l-end:l-text,ie-OS4zLzEwICA2Ny41SyBWb3Rlcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00430623-gxyubexxhw-portrait.jpg",
      rating: "9.3/10",
      votes: "67.5K Votes",
      link: "login"
    },
    
    // Add other movies here...
  ];

  scrollAmount = 0;
  scrollStep = 300;
  private touchStartX = 0;

  constructor() { }

  ngOnInit(): void {
  }

  scrollPrev(carousel: HTMLElement): void {
    this.scrollAmount -= this.scrollStep;
    if (this.scrollAmount < 0) this.scrollAmount = 0;
    carousel.scrollTo({
      left: this.scrollAmount,
      behavior: 'smooth'
    });
  }

  scrollNext(carousel: HTMLElement): void {
    this.scrollAmount += this.scrollStep;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    if (this.scrollAmount > maxScroll) this.scrollAmount = maxScroll;
    carousel.scrollTo({
      left: this.scrollAmount,
      behavior: 'smooth'
    });
  }

  handleTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  handleTouchEnd(event: TouchEvent, carousel: HTMLElement): void {
    const touchEndX = event.changedTouches[0].screenX;
    if (touchEndX < this.touchStartX - 50) {
      this.scrollNext(carousel); // Swipe left
    }
    if (touchEndX > this.touchStartX + 50) {
      this.scrollPrev(carousel); // Swipe right
    }
  }
}