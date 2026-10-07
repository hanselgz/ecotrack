import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Reporte, ReporteService } from '../../services/reporte.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="profile-shell">
      <div class="card profile-card">
        <div class="card-header">
          <div>
            <span class="eyebrow">Perfil</span>
            <h2>Mi cuenta</h2>
          </div>
          <span class="score-pill">Puntuación: {{ score }}</span>
        </div>

        <div class="profile-grid">
          <div class="field-group">
            <label>Nombre</label>
            <input type="text" [(ngModel)]="form.nombre" name="nombre" />
          </div>

          <div class="field-group">
            <label>Apellido</label>
            <input type="text" [(ngModel)]="form.apellido" name="apellido" />
          </div>

          <div class="field-group full-width">
            <label>Correo electrónico</label>
            <input type="email" [(ngModel)]="form.email" name="email" />
          </div>
        </div>

        <div class="actions-row">
          <button class="btn-primary" type="button" (click)="guardarPerfil()">Guardar cambios</button>
        </div>
      </div>

      <div class="card stats-card">
        <h3>Resumen</h3>
        <div class="stats-grid">
          <div class="stat-box">
            <span>Total de reportes</span>
            <strong>{{ reportes.length }}</strong>
          </div>
          <div class="stat-box">
            <span>Reportes resueltos</span>
            <strong>{{ resueltos }}</strong>
          </div>
          <div class="stat-box">
            <span>En revisión</span>
            <strong>{{ enRevision }}</strong>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 2rem 1.25rem 4rem;
        background: #f3f6f3;
      }

      .profile-shell {
        max-width: 980px;
        margin: 0 auto;
        display: grid;
        gap: 1.4rem;
      }

      .card {
        background: #fff;
        border: 1px solid #dfe9e3;
        border-radius: 20px;
        box-shadow: 0 12px 30px rgba(19, 35, 29, 0.06);
        padding: 1.5rem;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: center;
        margin-bottom: 1.25rem;
      }

      .eyebrow {
        display: inline-block;
        font-size: 0.72rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #2f7d4b;
        font-weight: 700;
      }

      h2, h3 {
        margin: 0.35rem 0 0;
        color: #172822;
      }

      .score-pill {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #ebf9ef;
        color: #1d6d42;
        padding: 0.5rem 0.8rem;
        border-radius: 999px;
        font-weight: 700;
      }

      .profile-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
      }

      .field-group {
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
      }

      .full-width {
        grid-column: 1 / -1;
      }

      label {
        font-size: 0.8rem;
        font-weight: 700;
        color: #536862;
      }

      input {
        border: 1px solid #d9e3dd;
        background: #fff;
        border-radius: 10px;
        height: 46px;
        padding: 0.75rem 0.9rem;
        font-size: 0.95rem;
        color: #182b24;
      }

      .actions-row {
        margin-top: 1.2rem;
      }

      .btn-primary {
        border: none;
        border-radius: 12px;
        background: linear-gradient(135deg, #2f7d4b 0%, #1d6040 100%);
        color: #fff;
        font-weight: 700;
        padding: 0.85rem 1.3rem;
        cursor: pointer;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }

      .stat-box {
        background: #f5faf7;
        border: 1px solid #dfeae3;
        border-radius: 16px;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }

      .stat-box span {
        color: #5d716b;
        font-size: 0.8rem;
      }

      .stat-box strong {
        color: #172822;
        font-size: 1.5rem;
      }

      @media (max-width: 700px) {
        .profile-grid,
        .stats-grid {
          grid-template-columns: 1fr;
        }

        .card-header {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `
  ]
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private reporteService = inject(ReporteService);
  private destroyRef = inject(DestroyRef);
  private changeDetector = inject(ChangeDetectorRef);

  form = {
    nombre: '',
    apellido: '',
    email: ''
  };

  score = 82;
  reportes: any[] = [];
  resueltos = 0;
  enRevision = 0;

  ngOnInit(): void {
    this.authService.currentUser$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user) => {
      if (!user) return;

      this.form = {
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || ''
      };
      this.score = user.puntuacion_ambiental ?? 82;
    });

    this.reporteService.reportes$.pipe(
      filter((reportes): reportes is Reporte[] => reportes !== null),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((reportes) => this.actualizarResumen(reportes));

    this.reporteService.obtenerReportes().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      error: () => {
        this.reportes = [];
        this.resueltos = 0;
        this.enRevision = 0;
      }
    });
  }

  private actualizarResumen(reportes: Reporte[]): void {
    const userId = this.authService.getCurrentUser()?.id;
    this.reportes = reportes.filter((reporte) => Number(reporte.usuario_id) === Number(userId));
    this.resueltos = this.reportes.filter((reporte) => String(reporte.estado || '').toLowerCase() === 'resuelto').length;
    this.enRevision = this.reportes.filter((reporte) => String(reporte.estado || '').toLowerCase() === 'en revision').length;
    this.changeDetector.markForCheck();
  }

  guardarPerfil(): void {
    const user = JSON.parse(localStorage.getItem('ecotrack_user') || '{}');
    const actualizado = {
      ...user,
      nombre: this.form.nombre,
      apellido: this.form.apellido,
      email: this.form.email
    };

    localStorage.setItem('ecotrack_user', JSON.stringify(actualizado));
    this.authService.updateCurrentUser(actualizado);
    alert('Perfil actualizado localmente.');
  }
}
