import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Song } from '../../../core/models/models';
import { SongService } from '../../../core/services/song.service';
import { SongCardComponent } from '../../../shared/components/song-card/song-card.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SongCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  trending = signal<Song[]>([]);
  latest   = signal<Song[]>([]);
  loading  = signal(true);
  error    = signal('');

  // track both requests finishing
  private trendingDone = false;
  private latestDone   = false;

  constructor(
    public songService: SongService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadSongs();
  }

  loadSongs(): void {
    this.loading.set(true);
    this.error.set('');
    this.trendingDone = false;
    this.latestDone   = false;

    this.songService.getTrending().subscribe({
      next: (songs) => {
        this.trending.set(songs);
        this.trendingDone = true;
        this.checkDone();
      },
      error: () => {
        this.error.set('Could not load songs. Is the backend running on http://localhost:8080?');
        this.loading.set(false);
      }
    });

    this.songService.getLatest().subscribe({
      next: (songs) => {
        this.latest.set(songs);
        this.latestDone = true;
        this.checkDone();
      },
      error: () => {
        this.latestDone = true;
        this.checkDone();
      }
    });
  }

  private checkDone(): void {
    if (this.trendingDone && this.latestDone) {
      this.loading.set(false);
    }
  }

  playAll(songs: Song[]): void {
    if (songs.length) this.songService.playSong(songs[0], songs);
  }

  getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 18) return 'afternoon';
    return 'evening';
  }
}