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
    <section class="auth-shell">
      <div class="auth-card">
        <div class="auth-copy">
          <span class="eyebrow">EcoTrack</span>
          <h1>Únete a la comunidad</h1>
          <p>Registra tu cuenta y empieza a reportar problemas ambientales en tu zona.</p>
        </div>

        <div class="auth-form-wrap">
          <h2>Crear cuenta</h2>

          <div *ngIf="errorMessage" class="alert error">
            {{ errorMessage }}
          </div>

          <form (ngSubmit)="onRegister()" #registerForm="ngForm">
            <div class="field-row">
              <label class="field">
                <span>Nombre</span>
                <input type="text" [(ngModel)]="user.nombre" name="nombre" required placeholder="Tu nombre" />
              </label>

              <label class="field">
                <span>Apellido</span>
                <input type="text" [(ngModel)]="user.apellido" name="apellido" required placeholder="Tu apellido" />
              </label>
            </div>

            <label class="field">
              <span>Correo electrónico</span>
              <input type="email" [(ngModel)]="user.correo" name="correo" required email placeholder="tucorreo@ejemplo.com" />
            </label>

            <label class="field">
              <span>Contraseña</span>
              <input type="password" [(ngModel)]="user.password" name="password" required minlength="6" placeholder="••••••••" />
            </label>

            <button type="submit" class="primary-btn" [disabled]="!registerForm.valid || cargando">
              {{ cargando ? 'Creando cuenta...' : 'Registrarme' }}
            </button>
          </form>

          <p class="auth-footer">
            ¿Ya tienes cuenta?
            <a routerLink="/login">Inicia sesión</a>
          </p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .auth-shell {
      min-height: calc(100vh - 100px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem 3rem;
      background: linear-gradient(180deg, #061510 0%, #0d1f1a 100%);
    }

    .auth-card {
      width: min(980px, 100%);
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      background: rgba(10, 26, 21, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
    }

    .auth-copy {
      padding: 3rem 2rem;
      background: radial-gradient(circle at top left, rgba(61, 187, 143, 0.18), transparent 32%), #0d1f1a;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .eyebrow {
      display: inline-block;
      width: fit-content;
      padding: 0.45rem 0.7rem;
      border-radius: 999px;
      background: rgba(61, 187, 143, 0.12);
      color: #b8f5d9;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    h1 {
      margin: 1rem 0 0.8rem;
      font-size: clamp(2rem, 4vw, 3.2rem);
      line-height: 1.08;
    }

    .auth-copy p {
      margin: 0;
      color: rgba(238, 250, 244, 0.75);
      line-height: 1.8;
      font-size: 1rem;
    }

    .auth-form-wrap {
      padding: 2.2rem 2rem;
      background: #f6faf8;
      color: #14251f;
    }

    h2 {
      margin: 0 0 1.5rem;
      font-size: 1.8rem;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .field-row {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.9rem;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      font-size: 0.92rem;
      font-weight: 600;
    }

    input {
      width: 100%;
      border: 1px solid rgba(20, 37, 31, 0.12);
      border-radius: 14px;
      background: #fff;
      color: #11251d;
      padding: 0.9rem 1rem;
    }

    .primary-btn {
      margin-top: 0.3rem;
      border: none;
      border-radius: 999px;
      padding: 0.9rem 1rem;
      background: linear-gradient(135deg, #51d19a 0%, #2ea372 100%);
      color: #062a1d;
      font-weight: 800;
      cursor: pointer;
    }

    .primary-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .alert {
      margin-bottom: 1rem;
      border-radius: 12px;
      padding: 0.8rem 0.9rem;
      font-size: 0.9rem;
    }

    .alert.error {
      background: #ffe5e5;
      color: #9b1c1c;
      border: 1px solid #f2b5b5;
    }

    .auth-footer {
      margin-top: 1.4rem;
      color: #415a52;
      text-align: center;
      font-size: 0.95rem;
    }

    .auth-footer a {
      color: #0e7a57;
      text-decoration: none;
      font-weight: 700;
    }

    @media (max-width: 800px) {
      .auth-card {
        grid-template-columns: 1fr;
      }

      .field-row {
        grid-template-columns: 1fr;
      }

      .auth-copy {
        padding-bottom: 1rem;
      }
    }
  `]
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = { nombre: '', apellido: '', correo: '', password: '' };
  errorMessage = '';
  cargando = false;

  onRegister(): void {
    this.cargando = true;
    this.errorMessage = '';

    this.authService.register(this.user).subscribe({
      next: (res) => {
        this.cargando = false;
        if (res.success) {
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