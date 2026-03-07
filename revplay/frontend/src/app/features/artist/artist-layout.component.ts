import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PlayerComponent } from '../../shared/components/player/player.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-artist-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    PlayerComponent
  ],
  templateUrl: './artist-layout.component.html',
  styleUrl: './artist-layout.component.scss'
})
export class ArtistLayoutComponent {

  sidebarOpen: boolean = false;

  constructor(public authService: AuthService) {}

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  logout(): void {
    this.authService.logout();
  }
}
