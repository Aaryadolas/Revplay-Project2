import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'listener',
    canActivate: [authGuard],
    data: { role: 'LISTENER' },
    loadComponent: () => import('./features/listener/listener-layout.component').then(m => m.ListenerLayoutComponent),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./features/listener/home/home.component').then(m => m.HomeComponent) },
      { path: 'search', loadComponent: () => import('./features/listener/search/search.component').then(m => m.SearchComponent) },
      { path: 'favorites', loadComponent: () => import('./features/listener/favorites/favorites.component').then(m => m.FavoritesComponent) },
      { path: 'playlists', loadComponent: () => import('./features/listener/playlists/playlists.component').then(m => m.PlaylistsComponent) },
    ]
  },
  {
    path: 'artist',
    canActivate: [authGuard],
    data: { role: 'ARTIST' },
    loadComponent: () => import('./features/artist/artist-layout.component').then(m => m.ArtistLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/artist/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'upload', loadComponent: () => import('./features/artist/upload/upload.component').then(m => m.UploadComponent) },
      { path: 'albums', loadComponent: () => import('./features/artist/albums/albums.component').then(m => m.AlbumsComponent) },
      { path: 'analytics', loadComponent: () => import('./features/artist/analytics/analytics.component').then(m => m.AnalyticsComponent) },
    ]
  },
  { path: '**', redirectTo: '' }
];
