import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SongService } from '../../../core/services/song.service';
import { FavoriteService } from '../../../core/services/extra.services';
import { Song } from '../../../core/models/models';
import { SongCardComponent } from '../../../shared/components/song-card/song-card.component';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, SongCardComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  query = signal('');
  results = signal<Song[]>([]);
  loading = signal(false);
  searched = signal(false);
  selectedGenre = signal('');
  
  genres = ['Pop', 'Rock', 'Hip-Hop', 'R&B', 'Electronic', 'Jazz', 'Classical', 'Country'];
  private search$ = new Subject<string>();

  constructor(private songService: SongService, private favoriteService: FavoriteService) {
    this.search$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(q => { this.loading.set(true); return this.songService.search(q); })
    ).subscribe({
      next: (songs) => {
        this.results.set(songs);
        this.loading.set(false);
        this.searched.set(true);
      },
      error: () => this.loading.set(false)
    });
  }

  onSearch(q: string): void {
    this.query.set(q);
    if (q.trim().length >= 2) {
      this.search$.next(q);
    } else {
      this.results.set([]);
      this.searched.set(false);
    }
  }

  filteredResults(): Song[] {
    const genre = this.selectedGenre();
    if (!genre) return this.results();
    return this.results().filter(s => s.genre?.toLowerCase() === genre.toLowerCase());
  }

  toggleFavorite(song: Song): void {
    this.favoriteService.toggle(song.id).subscribe(res => {
      this.results.update(list => list.map(s => s.id === song.id ? { ...s, isFavorite: res.isFavorite } : s));
    });
  }

  getGenreColor(i: number): string {
    const colors = ['#1DB954', '#E91429', '#8D67AB', '#DC148C', '#148A08', '#1E3264', '#E8115B', '#477D95'];
    return colors[i % colors.length];
  }
}