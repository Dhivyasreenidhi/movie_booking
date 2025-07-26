import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HeadersComponent } from '../headers/headers.component';
import { FootersComponent } from '../footers/footers.component';

export interface Movie {
  title: string;
  language: string;
  image: string;
  rating: string;
  votes: string;
  link: string;
}

@Component({
  selector: 'app-now-streamings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgIf,HeadersComponent,FootersComponent],
  templateUrl: './now-streamings.component.html',
  styleUrls: ['./now-streamings.component.css']
})
export class NowStreamingsComponent {
  movies: Movie[] = [
    {
      title: "3-BHK",
      language: "Tamil",
      image: "https://assetscdn1.paytm.com/images/cinema/3-BHK--46c84b60-30b9-11f0-b426-a50671acfc24.jpg?format=webp",
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
      rating: "8.4ENSION_ATTRIBUTE_0_0,l-end/et00423507-bavrucgtpa-portrait.jpg",
      votes: "278K Votes",
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
    
  ];

  constructor() { }

  ngOnInit(): void { }
}