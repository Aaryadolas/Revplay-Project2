import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PlayerComponent } from '../../shared/components/player/player.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-listener-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, PlayerComponent],
  templateUrl: './listener-layout.component.html',
  styleUrls: ['./listener-layout.component.scss']
})
export class ListenerLayoutComponent {
  sidebarOpen = signal(false);

  constructor(public authService: AuthService) {}

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }
}
