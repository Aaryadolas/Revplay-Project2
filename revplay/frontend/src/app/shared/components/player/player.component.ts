import { Component, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongService } from '../../../core/services/song.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy {

  private audio = new Audio();
  private loadedUrl = ''; // tracks which URL is currently loaded

  constructor(public songService: SongService) {

    // Effect 1: A new song was selected → load it into the audio element
    effect(() => {
      const song = this.songService.currentSong();
      if (song?.audioUrl && song.audioUrl !== this.loadedUrl) {
        this.loadedUrl = song.audioUrl;
        this.audio.src = song.audioUrl;
        this.audio.load();
        // Only play if the service says we should be playing
        if (this.songService.isPlaying()) {
          this.audio.play().catch(() => {
            this.songService.isPlaying.set(false);
          });
        }
      }
    });

    // Effect 2: Play/pause was toggled
    effect(() => {
      const playing = this.songService.isPlaying();
      if (!this.loadedUrl) return; // nothing loaded yet
      if (playing) {
        this.audio.play().catch(() => {
          this.songService.isPlaying.set(false);
        });
      } else {
        this.audio.pause();
      }
    });

    // Effect 3: Volume changed
    effect(() => {
      this.audio.volume = this.songService.volume();
    });
  }

  ngOnInit(): void {
    // Sync progress bar while playing
    this.audio.addEventListener('timeupdate', () => {
      this.songService.currentTime.set(this.audio.currentTime);
    });

    // Get total duration once metadata is ready
    this.audio.addEventListener('loadedmetadata', () => {
      this.songService.duration.set(this.audio.duration);
    });

    // Song finished → repeat or go next
    this.audio.addEventListener('ended', () => {
      if (this.songService.isRepeat()) {
        this.audio.currentTime = 0;
        this.audio.play();
      } else {
        this.songService.isPlaying.set(false);
        this.songService.nextSong();
      }
    });

    // Audio load error
    this.audio.addEventListener('error', () => {
      console.error('❌ Could not load audio:', this.audio.src);
      console.error('→ Check backend is running and the file exists in uploads/audio/');
      this.songService.isPlaying.set(false);
    });
  }

  ngOnDestroy(): void {
    this.audio.pause();
    this.audio.src = '';
  }

  // Called when user drags the seek bar
  seek(event: Event): void {
    const val = parseFloat((event.target as HTMLInputElement).value);
    if (isFinite(val)) {
      this.audio.currentTime = val;
      this.songService.currentTime.set(val);
    }
  }

  onVolumeChange(event: Event): void {
    const val = parseFloat((event.target as HTMLInputElement).value);
    this.songService.setVolume(val);
  }

  formatTime(sec: number): string {
    if (!sec || isNaN(sec) || !isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  get fillPct(): number {
    const d = this.songService.duration();
    if (!d || d === 0) return 0;
    return (this.songService.currentTime() / d) * 100;
  }
}
