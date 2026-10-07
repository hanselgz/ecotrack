import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { Reporte, ReporteService } from '../../services/reporte.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private changeDetector = inject(ChangeDetectorRef);
  cargando: boolean = true;
  estadisticas: any = {
    total_reportes: 0,
    pendientes: 0,
    resueltos: 0,
    huella_promedio: 0,
    puntuacion_media: 0
  };

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
    this.reporteService.reportes$.pipe(
      filter((reportes): reportes is Reporte[] => reportes !== null),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((reportes) => {
      this.actualizarEstadisticas(reportes);
      this.cargando = false;
      this.changeDetector.markForCheck();
    });
  }

  cargarEstadisticas(): void {
    this.cargando = true;
    this.reporteService.obtenerReportes().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      error: (err: any) => {
        console.error('Error al cargar métricas del dashboard:', err);
        this.cargando = false;
      }
    });
  }

  private actualizarEstadisticas(reportes: Reporte[]): void {
    const pendientes = reportes.filter((reporte) => String(reporte.estado || '').toLowerCase() === 'pendiente').length;
    const resueltos = reportes.filter((reporte) => String(reporte.estado || '').toLowerCase() === 'resuelto').length;

    this.estadisticas = {
      ...this.estadisticas,
      total_reportes: reportes.length,
      pendientes,
      resueltos
    };
    this.changeDetector.markForCheck();
  }
}