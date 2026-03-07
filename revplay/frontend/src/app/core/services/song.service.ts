import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SongService {
  
  // Player signals
  readonly currentSong = signal<Song | null>(null);
  readonly isPlaying = signal(false);
  readonly currentTime = signal(0);
  readonly duration = signal(0);
  readonly volume = signal(1);
  readonly isShuffle = signal(false);
  readonly isRepeat = signal(false);
  readonly queue = signal<Song[]>([]);

  constructor(private http: HttpClient) {}

  getAllSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(`${environment.apiUrl}/songs/public/all`);
  }

  getTrending(): Observable<Song[]> {
    return this.http.get<Song[]>(`${environment.apiUrl}/songs/public/trending`);
  }

  getLatest(): Observable<Song[]> {
    return this.http.get<Song[]>(`${environment.apiUrl}/songs/public/latest`);
  }

  search(query: string): Observable<Song[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Song[]>(`${environment.apiUrl}/songs/public/search`, { params });
  }

  uploadSong(formData: FormData): Observable<Song> {
    return this.http.post<Song>(`${environment.apiUrl}/songs/artist/upload`, formData);
  }

  getMySongs(): Observable<Song[]> {
    return this.http.get<Song[]>(`${environment.apiUrl}/songs/artist/my-songs`);
  }

  incrementPlay(songId: number): Observable<Song> {
    return this.http.post<Song>(`${environment.apiUrl}/songs/${songId}/play`, {});
  }

  // Player controls
  playSong(song: Song, queue: Song[] = []): void {
    this.currentSong.set(song);
    this.isPlaying.set(true);
    if (queue.length) this.queue.set(queue);
  }

  togglePlay(): void {
    this.isPlaying.update(v => !v);
  }

  nextSong(): void {
    const q = this.queue();
    const idx = q.findIndex(s => s.id === this.currentSong()?.id);
    if (idx < q.length - 1) {
      this.currentSong.set(q[idx + 1]);
    }
  }

  prevSong(): void {
    const q = this.queue();
    const idx = q.findIndex(s => s.id === this.currentSong()?.id);
    if (idx > 0) {
      this.currentSong.set(q[idx - 1]);
    }
  }

  toggleShuffle(): void { this.isShuffle.update(v => !v); }
  toggleRepeat(): void { this.isRepeat.update(v => !v); }
  setVolume(v: number): void { this.volume.set(v); }
}
