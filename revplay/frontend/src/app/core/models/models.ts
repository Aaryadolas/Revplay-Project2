export interface User {
  id: number;
  username: string;
  email: string;
  role: 'LISTENER' | 'ARTIST';
  displayName?: string;
  token: string;
}

export interface Song {
  id: number;
  title: string;
  genre?: string;
  duration?: string;
  audioUrl?: string;
  coverImageUrl?: string;
  playCount: number;
  artistId: number;
  artistName: string;
  albumId?: number;
  albumTitle?: string;
  createdAt: string;
  isFavorite: boolean;
}

export interface Album {
  id: number;
  title: string;
  coverImageUrl?: string;
  description?: string;
  artistId: number;
  artistName: string;
  songs?: Song[];
  createdAt: string;
}

export interface Playlist {
  id: number;
  name: string;
  description?: string;
  coverImageUrl?: string;
  privacy: 'PUBLIC' | 'PRIVATE';
  ownerId: number;
  ownerName: string;
  songs?: Song[];
  createdAt: string;
}

export interface AnalyticsData {
  totalSongs: number;
  totalPlays: number;
  totalFavorites: number;
  topSongs: Song[];
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  role: string;
  displayName: string;
}
