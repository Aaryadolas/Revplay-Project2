import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Playlist } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PlaylistService {
  constructor(private http: HttpClient) {}

  createPlaylist(data: { name: string; description?: string; privacy: string }): Observable<Playlist> {
    return this.http.post<Playlist>(`${environment.apiUrl}/playlists`, data);
  }

  getMyPlaylists(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${environment.apiUrl}/playlists/my`);
  }

  addSong(playlistId: number, songId: number): Observable<Playlist> {
    return this.http.post<Playlist>(`${environment.apiUrl}/playlists/${playlistId}/songs/${songId}`, {});
  }

  removeSong(playlistId: number, songId: number): Observable<Playlist> {
    return this.http.delete<Playlist>(`${environment.apiUrl}/playlists/${playlistId}/songs/${songId}`);
  }

  deletePlaylist(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/playlists/${id}`);
  }
}
