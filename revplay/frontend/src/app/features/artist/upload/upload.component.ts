import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SongService } from '../../../core/services/song.service';
import { AlbumService } from '../../../core/services/extra.services';
import { Album } from '../../../core/models/models';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  albums = signal<Album[]>([]);
  loading = signal(false);
  success = signal(false);
  error = signal('');

  form = {
    title: '',
    genre: '',
    duration: '',
    albumId: '' as number | ''
  };

  audioFile: File | null = null;
  coverFile: File | null = null;
  audioFileName = signal('');
  coverFileName = signal('');
  audioPreview = signal('');

  genres = ['Pop', 'Rock', 'Hip-Hop', 'R&B', 'Electronic', 'Jazz', 'Classical', 'Country', 'Alternative', 'Indie'];

  constructor(private songService: SongService, private albumService: AlbumService) {}

  ngOnInit(): void {
    this.albumService.getMyAlbums().subscribe(albums => this.albums.set(albums));
  }

  onAudioSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.audioFile = input.files[0];
      this.audioFileName.set(input.files[0].name);
      const url = URL.createObjectURL(input.files[0]);
      this.audioPreview.set(url);
    }
  }

  onCoverSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.coverFile = input.files[0];
      this.coverFileName.set(input.files[0].name);
    }
  }

  onSubmit(): void {
    if (!this.form.title || !this.audioFile) {
      this.error.set('Song title and audio file are required');
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.success.set(false);

    const formData = new FormData();
    formData.append('title', this.form.title);
    if (this.form.genre) formData.append('genre', this.form.genre);
    if (this.form.duration) formData.append('duration', this.form.duration);
    formData.append('audioFile', this.audioFile);
    if (this.coverFile) formData.append('coverImage', this.coverFile);
    if (this.form.albumId) formData.append('albumId', String(this.form.albumId));

    this.songService.uploadSong(formData).subscribe({
      next: () => {
        this.success.set(true);
        this.loading.set(false);
        this.resetForm();
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Upload failed');
        this.loading.set(false);
      }
    });
  }

  resetForm(): void {
    this.form = { title: '', genre: '', duration: '', albumId: '' };
    this.audioFile = null;
    this.coverFile = null;
    this.audioFileName.set('');
    this.coverFileName.set('');
    this.audioPreview.set('');
  }
}
