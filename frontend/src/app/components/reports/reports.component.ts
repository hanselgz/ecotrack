import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReporteService, Reporte, Categoria } from '../../services/reporte.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reportes: any[] = [];
  reportesFiltrados: any[] = [];
  categorias: Categoria[] = [];

  cargando: boolean = false;

  // Filtros
  textoBusqueda: string = '';
  categoriaFiltro: string = '';
  estadoFiltro: string = '';

  // Modelo del formulario
  nuevoReporte = {
    titulo: '',
    descripcion: '',
    categoria_id: null as number | null,
    ubicacion: {
      departamento: '',
      municipio: '',
      latitud: 14.6418,
      longitud: -90.5132
    }
  };

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.cargarReportes();
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.reporteService.obtenerCategorias().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.categorias = data;
        } else if (data && Array.isArray(data.data)) {
          this.categorias = data.data;
        } else if (data && Array.isArray(data.categorias)) {
          this.categorias = data.categorias;
        }
      },
      error: () => {
        this.categorias = [
          { id: 1, nombre: 'Residuos / Basura' },
          { id: 2, nombre: 'Contaminación del Agua' },
          { id: 3, nombre: 'Contaminación del Aire' },
          { id: 4, nombre: 'Tala de Árboles' },
          { id: 5, nombre: 'Ruido Excesivo' }
        ];
      }
    });
  }

  cargarReportes(): void {
    this.cargando = true;
    this.reporteService.obtenerReportes().subscribe({
      next: (res: any) => {
        console.log('Respuesta del Backend al cargar reportes:', res);

        // Extraer el arreglo independientemente del formato de la respuesta
        let lista: any[] = [];
        if (Array.isArray(res)) {
          lista = res;
        } else if (res && Array.isArray(res.data)) {
          lista = res.data;
        } else if (res && Array.isArray(res.reportes)) {
          lista = res.reportes;
        }

        this.reportes = lista;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al obtener los reportes:', err);
        this.reportes = [];
        this.reportesFiltrados = [];
        this.cargando = false;
      }
    });
  }

  guardarReporte(): void {
    if (!this.nuevoReporte.titulo || !this.nuevoReporte.categoria_id) {
      alert('Por favor completa los campos obligatorios (*)');
      return;
    }

    const payload = {
      titulo: this.nuevoReporte.titulo,
      descripcion: this.nuevoReporte.descripcion,
      usuario_id: 1,
      categoria_id: Number(this.nuevoReporte.categoria_id),
      ubicacion: {
        departamento: this.nuevoReporte.ubicacion.departamento,
        municipio: this.nuevoReporte.ubicacion.municipio,
        latitud: Number(this.nuevoReporte.ubicacion.latitud),
        longitud: Number(this.nuevoReporte.ubicacion.longitud)
      }
    };

    this.reporteService.crearReporte(payload).subscribe({
      next: (res: any) => {
        alert('¡Reporte publicado con éxito!');
        this.resetearFormulario();
        this.cargarReportes(); // Recargar inmediatamente la lista
      },
      error: (err: any) => {
        console.error('Error al guardar reporte:', err);
        const mensaje = err.error?.message || err.error?.error || 'Error al guardar el reporte.';
        alert(mensaje);
      }
    });
  }

  aplicarFiltros(): void {
    if (!Array.isArray(this.reportes)) {
      this.reportesFiltrados = [];
      return;
    }

    const termino = this.textoBusqueda.trim().toLowerCase();

    this.reportesFiltrados = this.reportes.filter((rep: any) => {
      // Buscar en título y descripción
      const titulo = rep.titulo || rep['titulo'] || '';
      const descripcion = rep.descripcion || rep['descripcion'] || '';
      const coincideTexto = !termino || 
        titulo.toLowerCase().includes(termino) ||
        descripcion.toLowerCase().includes(termino);

      // Filtro por categoría
      const catId = rep.categoria_id || rep['categoria_id'] || rep.categoriaId;
      const coincideCategoria = !this.categoriaFiltro || 
        String(catId) === String(this.categoriaFiltro);

      // Filtro por estado
      const estado = rep.estado || rep['estado'] || 'Pendiente';
      const coincideEstado = !this.estadoFiltro || 
        estado.toLowerCase() === this.estadoFiltro.toLowerCase();

      return coincideTexto && coincideCategoria && coincideEstado;
    });
  }

  contarPorEstado(estado: string): number {
    if (!Array.isArray(this.reportes)) return 0;
    return this.reportes.filter((r: any) => {
      const e = r.estado || r['estado'] || 'Pendiente';
      return e.toLowerCase() === estado.toLowerCase();
    }).length;
  }

  resetearFormulario(): void {
    this.nuevoReporte = {
      titulo: '',
      descripcion: '',
      categoria_id: null,
      ubicacion: {
        departamento: '',
        municipio: '',
        latitud: 14.6418,
        longitud: -90.5132
      }
    };
  }

  getBadgeClass(estado?: string): string {
    switch (estado) {
      case 'Resuelto': return 'badge-success';
      case 'En Proceso': return 'badge-warning';
      case 'Pendiente': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  onEstadoChange(id: number | undefined, event: Event): void {
    const select = event.target as HTMLSelectElement;
    console.log(`Estado del reporte ${id} actualizado a: ${select.value}`);
  }
}