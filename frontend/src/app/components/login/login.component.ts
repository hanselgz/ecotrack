import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="card auth-card">
        <h2>🌱 Iniciar Sesión</h2>
        <p class="subtitle">Accede a tu cuenta de EcoTrack</p>

        <div *ngIf="errorMessage" class="alert error">
          {{ errorMessage }}
        </div>

        <form (ngSubmit)="onLogin()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email">Correo Electrónico *</label>
            <input 
              type="email" 
              id="email" 
              [(ngModel)]="credentials.correo" 
              name="correo" 
              required 
              email
              placeholder="ejemplo@ecotrack.org"
            >
          </div>

          <div class="form-group">
            <label for="password">Contraseña *</label>
            <input 
              type="password" 
              id="password" 
              [(ngModel)]="credentials.password" 
              name="password" 
              required 
              placeholder="••••••••"
            >
          </div>

          <button type="submit" class="btn-primary" [disabled]="!loginForm.valid || cargando">
            {{ cargando ? 'Iniciando sesión...' : 'Ingresar' }}
          </button>
        </form>

        <p class="auth-footer">
          ¿No tienes una cuenta? <a routerLink="/register">Regístrate aquí</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      background-color: #f4f6f8;
      padding: 1rem;
    }
    .auth-card {
      width: 100%;
      max-width: 400px;
      padding: 2rem;
      background: #FFFFFF;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    h2 { color: #1D5A8B; margin-bottom: 0.2rem; }
    .subtitle { color: #666; margin-bottom: 1.5rem; font-size: 0.9rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.2rem; }
    .form-group label { font-size: 0.85rem; font-weight: bold; color: #343A40; }
    .form-group input { padding: 0.6rem; border: 1px solid #ccc; border-radius: 4px; font-size: 0.95rem; }
    .btn-primary {
      width: 100%;
      background-color: #1D5A8B;
      color: white;
      border: none;
      padding: 0.75rem;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
      font-size: 1rem;
    }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .alert { padding: 0.75rem; border-radius: 4px; margin-bottom: 1rem; font-size: 0.85rem; }
    .alert.error { background-color: #f8d7da; color: #DC3545; border: 1px solid #f5c6cb; }
    .auth-footer { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: #666; }
    .auth-footer a { color: #1D5A8B; font-weight: bold; text-decoration: none; }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials = { correo: '', password: '' };
  errorMessage: string = '';
  cargando: boolean = false;

  onLogin(): void {
    this.cargando = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        this.cargando = false;
        if (res.success) {
          this.router.navigate(['/reports']);
        }
      },
      error: (err) => {
        this.cargando = false;
        this.errorMessage = err.error?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
      }
    });
  }
}