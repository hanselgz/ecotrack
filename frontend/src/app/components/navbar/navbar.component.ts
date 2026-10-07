import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar">
      <div class="brand">
        <a routerLink="/">🌱 EcoTrack</a>
      </div>
      <div class="user-menu" *ngIf="authService.currentUser$ | async as user; else guest">
        <span>👤 {{ user.nombre }} ({{ user.rol_nombre || 'USER' }})</span>
        <button class="btn-logout" (click)="logout()">Cerrar Sesión</button>
      </div>
      <ng-template #guest>
        <div class="auth-links">
          <a routerLink="/login" class="nav-link">Iniciar Sesión</a>
          <a routerLink="/register" class="nav-link btn-register">Registrarse</a>
        </div>
      </ng-template>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: #1D5A8B;
      color: #FFFFFF;
      padding: 0.8rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand a { color: #FFFFFF; font-size: 1.4rem; font-weight: bold; text-decoration: none; }
    .auth-links { display: flex; gap: 1rem; align-items: center; }
    .nav-link { color: #A8DADC; text-decoration: none; font-weight: 500; }
    .btn-register { background: #A8DADC; color: #1D5A8B; padding: 0.4rem 0.8rem; border-radius: 4px; font-weight: bold; }
    .btn-logout { background: #DC3545; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; font-weight: bold; }
    .user-menu { display: flex; gap: 1rem; align-items: center; }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}