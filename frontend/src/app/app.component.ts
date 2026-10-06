import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';

import { ReporteService } from './services/reporte.service';
import { ReporteAmbiental, Categoria, ReporteInput } from './models/reporte.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit {
  private reporteService = inject(ReporteService);

  reportes: ReporteAmbiental[] = [];
  categorias: Categoria[] = [];
  cargando: boolean = true;

  private map!: L.Map;
  private markers: L.Marker[] = [];

  nuevoReporte: ReporteInput = this.inicializarFormulario();

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarReportes();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // Configuración para corregir íconos por defecto de Leaflet en Angular
    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = defaultIcon;

    // Inicializar mapa centrado en Guatemala
    this.map = L.map('map').setView([14.6418, -90.5132], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    // Al hacer clic sobre el mapa, asigna latitud y longitud al formulario
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.nuevoReporte.ubicacion.latitud = Number(e.latlng.lat.toFixed(6));
      this.nuevoReporte.ubicacion.longitud = Number(e.latlng.lng.toFixed(6));
    });
  }

  private renderMarkers(): void {
    if (!this.map) return;

    // Limpiar marcadores
    this.markers.forEach(m => m.remove());
    this.markers = [];

    // Pintar nuevos marcadores por cada reporte
    this.reportes.forEach(rep => {
      if (rep.latitud && rep.longitud) {
        const marker = L.marker([rep.latitud, rep.longitud])
          .addTo(this.map)
          .bindPopup(`
            <strong>${rep.titulo}</strong><br>
            <small>${rep.categoria_nombre || 'General'}</small><br>
            <span>Estado: <b>${rep.estado}</b></span><br>
            <span>📍 ${rep.municipio}, ${rep.departamento}</span>
          `);
        this.markers.push(marker);
      }
    });
  }

  inicializarFormulario(): ReporteInput {
    return {
      titulo: '',
      descripcion: '',
      usuario_id: 2,
      categoria_id: 1,
      ubicacion: {
        departamento: '',
        municipio: '',
        latitud: 14.6418,
        longitud: -90.5132
      }
    };
  }

  cargarReportes(): void {
    this.cargando = true;
    this.reporteService.getReportes().subscribe({
      next: (data) => {
        this.reportes = data || [];
        this.cargando = false;
        this.renderMarkers();
      },
      error: (err) => {
        console.error('Error al obtener reportes:', err);
        this.cargando = false;
      }
    });
  }

  cargarCategorias(): void {
    this.reporteService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data || [];
      },
      error: (err) => console.error('Error al obtener categorías:', err)
    });
  }

  guardarReporte(): void {
    this.reporteService.crearReporte(this.nuevoReporte).subscribe({
      next: (res) => {
        if (res.success) {
          alert('¡Reporte registrado exitosamente!');
          this.nuevoReporte = this.inicializarFormulario();
          this.cargarReportes();
        }
      },
      error: (err) => {
        alert('Error al guardar el reporte: ' + (err.error?.message || 'Error del servidor'));
      }
    });
  }

  onEstadoChange(id: number, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const nuevoEstado = select.value;

    this.reporteService.actualizarEstado(id, nuevoEstado).subscribe({
      next: () => {
        this.cargarReportes();
      },
      error: () => {
        alert('No se pudo actualizar el estado');
        this.cargarReportes();
      }
    });
  }

  contarPorEstado(estado: string): number {
    return this.reportes.filter(r => r.estado === estado).length;
  }

  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'Pendiente': return 'badge-pendiente';
      case 'En revisión': return 'badge-revision';
      case 'Verificado': return 'badge-verificado';
      case 'Resuelto': return 'badge-resuelto';
      case 'Rechazado': return 'badge-rechazado';
      default: return 'badge-default';
    }
  }
}