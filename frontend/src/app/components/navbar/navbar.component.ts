import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="header">
      <nav class="navbar" aria-label="Navegación principal">
        <div class="brand">
          <a routerLink="/" class="brand-link">
            <img src="/assets/ecotrack-logo.svg" alt="EcoTrack" class="brand-mark" />
            <span class="brand-text">EcoTrack</span>
          </a>
        </div>

        <div class="nav-actions">
          <a routerLink="/" class="nav-link">Inicio</a>
          <a routerLink="/dashboard" class="nav-link" *ngIf="authService.isLoggedIn()">Dashboard</a>
          <a routerLink="/calculator" class="nav-link" *ngIf="authService.isLoggedIn()">Consejos para ahorrar</a>
          <a routerLink="/reports" class="nav-link" *ngIf="authService.isLoggedIn()">Reportes</a>
          <ng-container *ngIf="authService.currentUser$ | async as user; else guest">
            <a routerLink="/profile" class="nav-link">Perfil</a>
            <span class="user-pill">{{ user.nombre || 'Usuario' }}</span>
            <button class="btn-logout" (click)="logout()">Salir</button>
          </ng-container>

          <ng-template #guest>
            <a routerLink="/login" class="nav-link btn-login">Iniciar sesión</a>
            <a routerLink="/register" class="nav-link btn-register">Registrarse</a>
          </ng-template>
        </div>
      </nav>
    </header>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .header {
        position: relative;
        width: 100%;
        padding: 8px 0;
        background: rgba(6, 16, 14, 0.7);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }

      .navbar {
        width: min(1150px, calc(100% - 24px));
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        background: rgba(14, 28, 24, 0.78);
        border: 1px solid rgba(169, 233, 209, 0.12);
        border-radius: 999px;
        padding: 0.7rem 1rem;
        box-shadow: 0 18px 32px rgba(0, 0, 0, 0.18);
      }

      .brand-link {
        display: inline-flex;
        align-items: center;
        gap: 0.65rem;
        color: #f1fff8;
        text-decoration: none;
        font-size: 1.2rem;
        font-weight: 800;
      }

      .brand-mark {
        width: 42px;
        height: 42px;
        display: block;
      }

      .brand-text {
        letter-spacing: -0.04em;
      }

      .nav-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .nav-link {
        color: #dfeae6;
        text-decoration: none;
        padding: 0.65rem 0.9rem;
        border-radius: 999px;
        font-weight: 600;
        transition: background 0.2s ease;
      }

      .nav-link:hover {
        background: rgba(255, 255, 255, 0.05);
      }

      .btn-login {
        background: rgba(255, 255, 255, 0.04);
      }

      .btn-register {
        background: linear-gradient(135deg, #7ee3b9 0%, #3dbb8f 100%);
        color: #062718;
      }

      .user-pill {
        display: inline-flex;
        align-items: center;
        padding: 0.55rem 0.8rem;
        border-radius: 999px;
        background: rgba(126, 227, 185, 0.12);
        color: #dffaf0;
        font-size: 0.92rem;
        font-weight: 700;
      }

      .btn-logout {
        border: none;
        border-radius: 999px;
        padding: 0.7rem 0.9rem;
        cursor: pointer;
        background: rgba(255, 86, 86, 0.12);
        color: #ffd4d4;
        font-weight: 700;
      }

      @media (max-width: 720px) {
        .navbar {
          border-radius: 20px;
          flex-direction: column;
        }

        .nav-actions {
          justify-content: center;
          gap: 0.25rem;
        }

        .nav-link {
          padding: 0.55rem 0.65rem;
          font-size: 0.88rem;
        }
      }
    `
  ]
})
export class NavbarComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
