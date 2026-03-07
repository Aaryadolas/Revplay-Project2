import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Playlist } from '../../../core/models/models';
import { PlaylistService } from '../../../core/services/playlist.service';
import { SongService } from '../../../core/services/song.service';

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit {
  playlists = signal<Playlist[]>([]);
  loading = signal(true);
  showModal = signal(false);
  selectedPlaylist = signal<Playlist | null>(null);

  newPlaylist = { name: '', description: '', privacy: 'PUBLIC' };
  creating = signal(false);

  constructor(private playlistService: PlaylistService, private songService: SongService) {}

  ngOnInit(): void {
    this.loadPlaylists();
  }

  loadPlaylists(): void {
    this.playlistService.getMyPlaylists().subscribe({
      next: (p) => { this.playlists.set(p); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  createPlaylist(): void {
    if (!this.newPlaylist.name.trim()) return;
    this.creating.set(true);
    this.playlistService.createPlaylist(this.newPlaylist).subscribe({
      next: (p) => {
        this.playlists.update(list => [p, ...list]);
        this.showModal.set(false);
        this.newPlaylist = { name: '', description: '', privacy: 'PUBLIC' };
        this.creating.set(false);
      },
      error: () => this.creating.set(false)
    });
  }

  selectPlaylist(p: Playlist): void {
    this.selectedPlaylist.set(p);
  }

  deletePlaylist(id: number): void {
    this.playlistService.deletePlaylist(id).subscribe(() => {
      this.playlists.update(list => list.filter(p => p.id !== id));
      if (this.selectedPlaylist()?.id === id) this.selectedPlaylist.set(null);
    });
  }

  playPlaylist(p: Playlist): void {
    if (p.songs?.length) {
      this.songService.playSong(p.songs[0], p.songs);
    }
  }
}
