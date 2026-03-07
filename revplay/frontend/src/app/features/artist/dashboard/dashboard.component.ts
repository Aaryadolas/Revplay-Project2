import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnalyticsData, Song } from '../../../core/models/models';
import { AnalyticsService } from '../../../core/services/extra.services';
import { AuthService } from '../../../core/services/auth.service';
import { SongService } from '../../../core/services/song.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  analytics = signal<AnalyticsData | null>(null);
  loading = signal(true);

  constructor(
    private analyticsService: AnalyticsService,
    public authService: AuthService,
    public songService: SongService
  ) {}

  ngOnInit(): void {
    this.analyticsService.getArtistAnalytics().subscribe({
      next: (data) => { this.analytics.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  playTopSong(song: Song, songs: Song[]): void {
    this.songService.playSong(song, songs);
  }

  getPlayPercent(song: Song, songs: Song[]): number {
    const max = Math.max(...songs.map(s => s.playCount));
    return max > 0 ? (song.playCount / max) * 100 : 0;
  }
}
