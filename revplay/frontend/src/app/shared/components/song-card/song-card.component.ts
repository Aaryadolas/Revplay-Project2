import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Song } from '../../../core/models/models';
import { SongService } from '../../../core/services/song.service';

@Component({
  selector: 'app-song-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="song-card" (click)="onPlay()" [class.is-playing]="isCurrentAndPlaying()">

      <div class="card-cover">
        <!-- Cover image — hidden if URL is broken -->
        <img
          *ngIf="song.coverImageUrl && !imgError"
          [src]="song.coverImageUrl"
          [alt]="song.title"
          (error)="imgError = true">

        <!-- Fallback icon -->
        <span class="cover-icon" *ngIf="!song.coverImageUrl || imgError">🎵</span>

        <!-- Hover play button -->
        <div class="hover-overlay">
          <button class="overlay-play" (click)="onPlay(); $event.stopPropagation()">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>

        <!-- Animated equaliser bars when this song is playing -->
        <div class="eq-bars" *ngIf="isCurrentAndPlaying()">
          <span></span><span></span><span></span>
        </div>
      </div>

      <div class="card-body">
        <span class="card-title">{{ song.title }}</span>
        <span class="card-artist">{{ song.artistName }}</span>
        <div class="card-meta">
          <span class="genre-tag" *ngIf="song.genre">{{ song.genre }}</span>
          <span class="play-count">{{ song.playCount }} plays</span>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .song-card {
      background: #1e1e1e;
      border-radius: 8px;
      padding: 14px;
      cursor: pointer;
      transition: background 0.2s, transform 0.15s;
      position: relative;
      border: 1px solid transparent;

      &:hover {
        background: #2a2a2a;
        transform: translateY(-3px);
        .hover-overlay { opacity: 1; }
      }

      &.is-playing {
        border-color: rgba(29, 185, 84, 0.5);
        background: #1a2a1e;
      }
    }

    .card-cover {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 6px;
      background: #282828;
      margin-bottom: 12px;
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .cover-icon {
        font-size: 38px;
        user-select: none;
      }
    }

    .hover-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .overlay-play {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: #1DB954;
      border: none;
      color: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.15s, background 0.2s;

      &:hover {
        transform: scale(1.1);
        background: #1ed760;
      }
    }

    /* Animated EQ bars shown when this exact song is playing */
    .eq-bars {
      position: absolute;
      bottom: 7px;
      left: 8px;
      display: flex;
      align-items: flex-end;
      gap: 2px;
      height: 14px;

      span {
        width: 3px;
        background: #1DB954;
        border-radius: 2px;
        animation: eq 0.8s ease-in-out infinite alternate;

        &:nth-child(1) { height: 55%; animation-delay: 0s; }
        &:nth-child(2) { height: 100%; animation-delay: 0.2s; }
        &:nth-child(3) { height: 65%; animation-delay: 0.4s; }
      }
    }

    @keyframes eq {
      from { transform: scaleY(0.35); }
      to   { transform: scaleY(1); }
    }

    .card-body {
      display: flex;
      flex-direction: column;
      gap: 3px;
      overflow: hidden;
    }

    .card-title {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-artist {
      display: block;
      font-size: 12px;
      color: #b3b3b3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 5px;
    }

    .genre-tag {
      background: rgba(29, 185, 84, 0.15);
      color: #1DB954;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 500px;
      text-transform: uppercase;
    }

    .play-count {
      font-size: 11px;
      color: #6e6e6e;
    }
  `]
})
export class SongCardComponent {
  @Input() song!: Song;
  @Input() queue: Song[] = []; // full list passed from parent for next/prev

  @Output() toggleFav = new EventEmitter<Song>();

  imgError = false; // set true when cover image 404s

  constructor(private songService: SongService) {}

  onPlay(): void {
    // Always pass the full queue so next/prev buttons work
    const q = this.queue.length ? this.queue : [this.song];
    this.songService.playSong(this.song, q);
  }

  isCurrentAndPlaying(): boolean {
    return this.songService.currentSong()?.id === this.song.id
        && this.songService.isPlaying();
  }
}
