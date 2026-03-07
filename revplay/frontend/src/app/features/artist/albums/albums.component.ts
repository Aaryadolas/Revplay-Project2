import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Album } from '../../../core/models/models';
import { AlbumService } from '../../../core/services/extra.services';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss']
})
export class AlbumsComponent implements OnInit {
  albums = signal<Album[]>([]);
  loading = signal(true);
  showModal = signal(false);
  creating = signal(false);
  selected = signal<Album | null>(null);

  form = { title: '', description: '' };

  constructor(private albumService: AlbumService) {}

  ngOnInit(): void {
    this.albumService.getMyAlbums().subscribe({
      next: (a) => { this.albums.set(a); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  create(): void {
    if (!this.form.title.trim()) return;
    this.creating.set(true);
    this.albumService.create(this.form).subscribe({
      next: (a) => {
        this.albums.update(list => [a, ...list]);
        this.showModal.set(false);
        this.form = { title: '', description: '' };
        this.creating.set(false);
      },
      error: () => this.creating.set(false)
    });
  }
}
