import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadersComponent } from '../headers/headers.component';
import { FootersComponent } from '../footers/footers.component';

@Component({
  selector: 'app-coming-soons',
  standalone: true,
  imports: [CommonModule, HeadersComponent, FootersComponent],
  templateUrl: './coming-soons.component.html',
  styleUrls: ['./coming-soons.component.css']
})
export class ComingSoonsComponent {
  showPopup = false;
  selectedMovie: any = {};

  movies = [
    {
      title: 'KUBERAA',
      language: 'TELUGU',
      posterUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/kuberaa-et00390532-1750660979.jpg',
      tag: 'BLOCKBUSTER',
      rating: '4.7/5',
      genre: 'Action, Thriller',
      duration: '2h 20m',
      releaseDate: 'Jun 15, 2025',
      director: 'Sekhar Kammula',
      cast: ['Dhanush', 'Naga Arjuna', 'Rashmika'],
      synopsis: 'An epic action thriller about a heist that goes wrong.'
    },
    {
      title: 'OHO ENTHAN BABY',
      language: 'TAMIL',
      posterUrl: 'https://originserver-static1-uat.pvrcinemas.com/pvrcms/movie_v/34468_5DieZdFO.jpg',
      tag: 'NEW',
      rating: '4.2/5',
      genre: 'Action, Crime',
      duration: '2h 35m',
      releaseDate: 'Apr 10, 2025',
      director: 'Unknown',
      cast: ['vishnu vishal', 'Actor 2', 'Actor 3'],
      synopsis: 'A thrilling crime drama about unexpected events.'
    },
    {
      title: 'DNA',
      language: 'TAMIL',
      posterUrl: 'https://originserver-static1-uat.pvrcinemas.com/pvrcms/movie_v/34248_LdYonbmU.jpg',
      tag: 'HOT',
      rating: '3.9/5',
      genre: 'Action, Thriller',
      duration: '2h 15m',
      releaseDate: 'Apr 12, 2025',
      director: 'Unknown',
      cast: ['Atharava', 'Actor 2', 'Actor 3'],
      synopsis: 'A genetic thriller with unexpected twists.'
    },
    {
      title: '3-BHK',
      language: 'TAMIL',
      posterUrl: 'https://originserver-static1-uat.pvrcinemas.com/pvrcms/movie_v/33887_AOp7mlKR.jpg',
      tag: 'TRENDING',
      rating: '4.1/5',
      genre: 'Drama, Romance',
      duration: '2h 25m',
      releaseDate: 'May 1, 2025',
      director: 'Unknown',
      cast: ['Sidharath', 'Sarathkumar', 'Devayani'],
      synopsis: 'A story about relationships and modern living.'
    },
    {
      title: 'MAARGAN',
      language: 'HINDI',
      posterUrl: 'https://originserver-static1-uat.pvrcinemas.com/pvrcms/movie_v/34117_ip8AcAO4.jpg',
      tag: 'BLOCKBUSTER',
      rating: '4.8/5',
      genre: 'Action, Drama',
      duration: '2h 30m',
      releaseDate: 'May 1, 2025',
      director: 'Unknown',
      cast: ['Vijay Antony', 'Actor 2', 'Actor 3'],
      synopsis: 'High-octane action drama about justice.'
    }
  ];

  openMovieDetails(movie: any) {
    this.selectedMovie = movie;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }
}