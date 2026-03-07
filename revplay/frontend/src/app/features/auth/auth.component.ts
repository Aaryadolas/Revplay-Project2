import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  mode = signal<'login' | 'register'>('login');
  loading = signal(false);
  error = signal('');

  loginForm = {
    email: '',
    password: '',
    rememberMe: false
  };

  registerForm = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'LISTENER' as 'LISTENER' | 'ARTIST',
    displayName: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  setMode(m: 'login' | 'register'): void {
    this.mode.set(m);
    this.error.set('');
  }

  onLogin(): void {
    this.error.set('');
    this.loading.set(true);
    this.authService.login({ email: this.loginForm.email, password: this.loginForm.password })
      .subscribe({
        error: (err) => {
          this.error.set(err.error?.message || 'Invalid credentials');
          this.loading.set(false);
        }
      });
  }

  onRegister(): void {
    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      this.error.set('Passwords do not match');
      return;
    }
  
    this.error.set('');
    this.loading.set(true);
  
    this.authService.register({
      username: this.registerForm.username,
      email: this.registerForm.email,
      password: this.registerForm.password,
      role: this.registerForm.role,
      displayName: this.registerForm.displayName
    }).subscribe({
       next: (res: any) => {
        this.loading.set(false);
      
        // Save token
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
      
        if (res.role === 'LISTENER') {
          this.router.navigate(['/listener']);
        } else if (res.role === 'ARTIST') {
          this.router.navigate(['/artist']);
        }
      },
      // error: (err) => {
      //   this.error.set(err.error?.message || 'Registration failed');
      //   this.loading.set(false);
      // }
    });
  }
}
