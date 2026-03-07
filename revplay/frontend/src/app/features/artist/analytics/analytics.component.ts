import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AnalyticsData } from '../../../core/models/models';
import { AnalyticsService } from '../../../core/services/extra.services';
import { SongService } from '../../../core/services/song.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  analytics = signal<AnalyticsData | null>(null);
  loading = signal(true);

  constructor(private analyticsService: AnalyticsService, public songService: SongService) {}

  ngOnInit(): void {
    this.analyticsService.getArtistAnalytics().subscribe({
      next: (d) => { this.analytics.set(d); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  getPlayPercent(playCount: number): number {
    const top = this.analytics()?.topSongs ?? [];
    const max = Math.max(...top.map(s => s.playCount), 1);
    return (playCount / max) * 100;
  }

  // Fake weekly data for chart visualization
  get weeklyData(): number[] {
    const total = this.analytics()?.totalPlays ?? 0;
    if (total === 0) return [0, 0, 0, 0, 0, 0, 0];
    const base = Math.floor(total / 10);
    return [
      Math.floor(base * 0.6),
      Math.floor(base * 0.8),
      Math.floor(base * 1.2),
      Math.floor(base * 0.9),
      Math.floor(base * 1.5),
      Math.floor(base * 1.1),
      Math.floor(base * 1.3)
    ];
  }

  get weekMax(): number {
    return Math.max(...this.weeklyData, 1);
  }

  days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
}
