import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song, AnalyticsData, Album } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  constructor(private http: HttpClient) {}

  toggle(songId: number): Observable<{ isFavorite: boolean }> {
    return this.http.post<{ isFavorite: boolean }>(`${environment.apiUrl}/favorites/${songId}/toggle`, {});
  }

  getFavorites(): Observable<Song[]> {
    return this.http.get<Song[]>(`${environment.apiUrl}/favorites`);
  }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(private http: HttpClient) {}

  getArtistAnalytics(): Observable<AnalyticsData> {
    return this.http.get<AnalyticsData>(`${environment.apiUrl}/analytics/artist`);
  }
}

@Injectable({ providedIn: 'root' })
export class AlbumService {
  constructor(private http: HttpClient) {}

  create(data: { title: string; description?: string }): Observable<Album> {
    return this.http.post<Album>(`${environment.apiUrl}/albums/artist`, data);
  }

  getMyAlbums(): Observable<Album[]> {
    return this.http.get<Album[]>(`${environment.apiUrl}/albums/artist/my`);
  }
}
