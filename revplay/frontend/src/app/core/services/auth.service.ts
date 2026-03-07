import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, User } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'revplay_token';
  private readonly USER_KEY = 'revplay_user';

  private _currentUser = signal<User | null>(this.loadUser());
  
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this._currentUser() !== null);
  readonly isArtist = computed(() => this._currentUser()?.role === 'ARTIST');
  readonly isListener = computed(() => this._currentUser()?.role === 'LISTENER');

  constructor(private http: HttpClient, private router: Router) {}

  register(data: { username: string; email: string; password: string; role: string; displayName?: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, data)
      .pipe(tap(res => this.handleAuthResponse(res)));
  }

  login(data: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, data)
      .pipe(tap(res => this.handleAuthResponse(res)));
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._currentUser.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private handleAuthResponse(res: AuthResponse): void {
    const user: User = {
      id: res.id,
      username: res.username,
      email: res.email,
      role: res.role as 'LISTENER' | 'ARTIST',
      displayName: res.displayName,
      token: res.token
    };
    localStorage.setItem(this.TOKEN_KEY, res.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this._currentUser.set(user);
    
    if (user.role === 'ARTIST') {
      this.router.navigate(['/artist/dashboard']);
    } else {
      this.router.navigate(['/listener/home']);
    }
  }

  private loadUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }
}
