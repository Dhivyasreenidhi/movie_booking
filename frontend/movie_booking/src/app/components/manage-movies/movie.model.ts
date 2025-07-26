interface Movie {
  id?: number;
  posterUrl: string;
  title: string;
  genre: string;
  duration: number;
  rating: string; // MPAA rating (G, PG, PG-13, R, NC-17)
  userRating: number; // 1-10 scale
  votes: number;
  releaseDate: string | Date;
}