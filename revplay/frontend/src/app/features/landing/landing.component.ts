import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  features = [
    { icon: '🎵', title: 'Discover Music', desc: 'Explore millions of tracks across every genre. Find your next favorite artist.' },
    { icon: '📂', title: 'Create Playlists', desc: 'Curate the perfect collection. Share with friends or keep it private.' },
    { icon: '🎤', title: 'Upload Your Songs', desc: 'Artists can upload tracks, manage albums, and track performance analytics.' }
  
  ];
  mobileMenuOpen = false;
}
