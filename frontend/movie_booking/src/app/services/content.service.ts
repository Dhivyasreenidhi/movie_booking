import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  constructor(private http: HttpClient) { }


  postBannerDetails(details: any): Observable<any> {
    // Validate required fields before posting
    if (!details.banner_id || !details.year || !details.duration || !details.rating || !details.storyLine) {
      console.error('Cannot post banner details: missing required fields', details);
      return of({ error: 'Missing required fields' });
    }
    // Ensure topCast is always a stringified array
    if (Array.isArray(details.topCast)) {
      details.topCast = JSON.stringify(details.topCast);
    } else if (typeof details.topCast !== 'string') {
      details.topCast = '[]';
    }
    console.log('Posting banner details:', details);
    return this.http.post<any>('/api/banner-details', details);
  }

  getBannerDetails(banner_id: number): Observable<any> {
    return this.http.get<any>(`/api/banner-details/${banner_id}`).pipe(
      // If 404, return empty object instead of error
      catchError(err => {
        if (err.status === 404) {
          return of({});
        }
        throw err;
      })
    );
  }
getBanner(): Observable<any[]> {
  return this.http.get<any[]>('/api/homepage-banner');
}

  postBanner(banner: any): Observable<any> {
    return this.http.post<any>('/api/homepage-banner', banner);
  }

  deleteBanner(id: number): Observable<any> {
    return this.http.delete<any>(`/api/homepage-banner/${id}`);
  }
}
