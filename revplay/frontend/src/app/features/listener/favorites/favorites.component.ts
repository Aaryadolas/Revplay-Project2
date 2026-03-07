import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Song } from '../../../core/models/models';
import { FavoriteService } from '../../../core/services/extra.services';
import { SongCardComponent } from '../../../shared/components/song-card/song-card.component';
import { SongService } from '../../../core/services/song.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, SongCardComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>❤️ Favorites</h1>
        <p>{{songs().length}} songs you love</p>
      </div>

      <div class="loading" *ngIf="loading()">Loading...</div>

      <div *ngIf="!loading()">
        <div class="songs-grid" *ngIf="songs().length">
          <app-song-card *ngFor="let song of songs()" [song]="song"
                         (toggleFav)="removeFavorite($event)"></app-song-card>
        </div>
        <div class="empty-state" *ngIf="!songs().length">
          <span>🤍</span>
          <h3>No favorites yet</h3>
          <p>Like songs to save them here</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 32px; }
    .page-header {
      margin-bottom: 32px;
      h1 { font-family: 'Montserrat', sans-serif; font-size: 32px; font-weight: 800; margin-bottom: 4px; }
      p { color: var(--text-secondary); }
    }
    .songs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; }
    .empty-state { text-align: center; padding: 80px;
      span { font-size: 64px; display: block; margin-bottom: 16px; }
      h3 { margin-bottom: 8px; }
      p { color: var(--text-secondary); }
    }
    .loading { color: var(--text-secondary); padding: 40px; }
  `]
})
export class FavoritesComponent implements OnInit {
  songs = signal<Song[]>([]);
  loading = signal(true);

  constructor(private favoriteService: FavoriteService, private songService: SongService) {}

  ngOnInit(): void {
    this.favoriteService.getFavorites().subscribe({
      next: (songs) => { this.songs.set(songs); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  removeFavorite(song: Song): void {
    this.favoriteService.toggle(song.id).subscribe(() => {
      this.songs.update(list => list.filter(s => s.id !== song.id));
    });
  }
}
