import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteService, Reporte } from '../../services/reporte.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  reportes: Reporte[] = [];
  stats: any = null;

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.reporteService.getReportes().subscribe({
      next: (res: Reporte[]) => {
        this.reportes = res;
      },
      error: (err: any) => console.error('Error al cargar reportes:', err)
    });

    this.reporteService.getStats().subscribe({
      next: (res: any) => {
        this.stats = res;
      },
      error: (err: any) => {
        console.error('Error al cargar estadísticas:', err);
      }
    });
  }
}