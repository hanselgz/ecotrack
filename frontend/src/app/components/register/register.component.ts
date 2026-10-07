import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="card auth-card">
        <h2>🌱 Crear Cuenta</h2>
        <p class="subtitle">Únete a EcoTrack y comienza a actuar por el planeta</p>

        <div *ngIf="errorMessage" class="alert error">
          {{ errorMessage }}
        </div>

        <form (ngSubmit)="onRegister()" #registerForm="ngForm">
          <div class="form-group">
            <label for="nombre">Nombre *</label>
            <input 
              type="text" 
              id="nombre" 
              [(ngModel)]="user.nombre" 
              name="nombre" 
              required 
              placeholder="Tu nombre"
            >
          </div>

          <div class="form-group">
            <label for="apellido">Apellido *</label>
            <input 
              type="text" 
              id="apellido" 
              [(ngModel)]="user.apellido" 
              name="apellido" 
              required 
              placeholder="Tu apellido"
            >
          </div>

          <div class="form-group">
            <label for="correo">Correo Electrónico *</label>
            <input 
              type="email" 
              id="correo" 
              [(ngModel)]="user.correo" 
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
              [(ngModel)]="user.password" 
              name="password" 
              required 
              minlength="6"
              placeholder="••••••••"
            >
          </div>

          <button type="submit" class="btn-primary" [disabled]="!registerForm.valid || cargando">
            {{ cargando ? 'Registrando...' : 'Registrarse' }}
          </button>
        </form>

        <p class="auth-footer">
          ¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a>
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
      max-width: 420px;
      padding: 2rem;
      background: #FFFFFF;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    h2 { color: #1D5A8B; margin-bottom: 0.2rem; }
    .subtitle { color: #666; margin-bottom: 1.5rem; font-size: 0.9rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem; }
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
      margin-top: 0.5rem;
    }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .alert { padding: 0.75rem; border-radius: 4px; margin-bottom: 1rem; font-size: 0.85rem; }
    .alert.error { background-color: #f8d7da; color: #DC3545; border: 1px solid #f5c6cb; }
    .auth-footer { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: #666; }
    .auth-footer a { color: #1D5A8B; font-weight: bold; text-decoration: none; }
  `]
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = { nombre: '', apellido: '', correo: '', password: '' };
  errorMessage: string = '';
  cargando: boolean = false;

  onRegister(): void {
    this.cargando = true;
    this.errorMessage = '';

    this.authService.register(this.user).subscribe({
      next: (res) => {
        this.cargando = false;
        if (res.success) {
          alert('¡Cuenta creada correctamente! Ahora puedes iniciar sesión.');
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.cargando = false;
        this.errorMessage = err.error?.message || 'Error al registrar usuario. Inténtalo de nuevo.';
      }
    });
  }
}