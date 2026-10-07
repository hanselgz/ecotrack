import { ChangeDetectorRef, Component, DestroyRef, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';
import * as L from 'leaflet';
import { AuthService } from '../../services/auth.service';
import { ReporteService, Reporte, Categoria } from '../../services/reporte.service';

interface ResultadoGeocodificacion {
  lat: string;
  lon: string;
  display_name: string;
  address?: Record<string, string>;
}

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
  guardandoReporte = false;
  mensajeReporte = '';
  estadosGuardando: Record<number, boolean> = {};
  mensajesEstado: Record<number, string> = {};
  erroresEstado: Record<number, boolean> = {};

  // Filtros
  textoBusqueda: string = '';
  categoriaFiltro: string = '';
  estadoFiltro: string = '';
  modoUbicacion: 'manual' | 'automatica' = 'manual';
  errorUbicacion: string | null = null;
  private mapaUbicacion?: L.Map;
  private marcadorUbicacion?: L.Marker;
  private elementoMapa?: HTMLDivElement;

  @ViewChild('locationMap')
  set contenedorMapa(elemento: ElementRef<HTMLDivElement> | undefined) {
    if (!elemento) {
      if (!this.elementoMapa) return;
      this.mapaUbicacion?.remove();
      this.mapaUbicacion = undefined;
      this.marcadorUbicacion = undefined;
      this.elementoMapa = undefined;
      return;
    }

    if (this.elementoMapa === elemento.nativeElement && this.mapaUbicacion) {
      this.mapaUbicacion.invalidateSize();
      return;
    }

    this.mapaUbicacion?.remove();
    this.elementoMapa = elemento.nativeElement;
    this.inicializarMapaUbicacion(elemento.nativeElement);
  }

  // Modelo del formulario
  nuevoReporte = {
    titulo: '',
    descripcion: '',
    categoria_id: null as number | null,
    ubicacion: {
      departamento: '',
      municipio: '',
      direccion: '',
      latitud: null as number | null,
      longitud: null as number | null
    }
  };

  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private changeDetector = inject(ChangeDetectorRef);

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.cargarReportes();
    this.cargarCategorias();
    this.reporteService.reportes$.pipe(
      filter((reportes): reportes is Reporte[] => reportes !== null),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((reportes) => {
      this.reportes = reportes;
      this.aplicarFiltros();
      this.cargando = false;
      this.changeDetector.markForCheck();
    });
  }

  cargarCategorias(): void {
    this.reporteService.obtenerCategorias().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
          { id: 1, nombre: 'Basura' },
          { id: 2, nombre: 'Agua' },
          { id: 3, nombre: 'Aire' },
          { id: 4, nombre: 'Suelo' },
          { id: 5, nombre: 'Deforestación' },
          { id: 6, nombre: 'Ruido' },
          { id: 7, nombre: 'Fauna y flora' },
          { id: 8, nombre: 'Otro' }
        ];
      }
    });

    if (this.categorias.length && !this.categorias.some((cat) => cat.nombre.toLowerCase() === 'otro')) {
      this.categorias.push({ id: Number.MAX_SAFE_INTEGER, nombre: 'Otro' });
    }
  }

  cargarReportes(): void {
    this.cargando = true;
    this.reporteService.obtenerReportes().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      error: (err: any) => {
        console.error('Error al obtener los reportes:', err);
        this.reportes = [];
        this.reportesFiltrados = [];
        this.cargando = false;
        this.changeDetector.markForCheck();
      }
    });
  }

  async guardarReporte(): Promise<void> {
    if (this.guardandoReporte || this.buscandoDireccion) return;

    if (!this.nuevoReporte.titulo || !this.nuevoReporte.categoria_id) {
      alert('Por favor completa los campos obligatorios (*)');
      return;
    }

    if (this.modoUbicacion === 'manual') {
      const direccion = this.nuevoReporte.ubicacion.direccion.trim();
      if (!direccion) {
        this.errorUbicacion = 'Escribe una dirección exacta para ubicar el reporte.';
        return;
      }

      if (this.direccionResuelta !== direccion || this.nuevoReporte.ubicacion.latitud == null || this.nuevoReporte.ubicacion.longitud == null) {
        const encontrada = await this.geocodificarDireccion(direccion);
        if (!encontrada) return;
      }
    }

    if (this.modoUbicacion === 'automatica' && (this.nuevoReporte.ubicacion.latitud == null || this.nuevoReporte.ubicacion.longitud == null)) {
      const ubicacion = await this.obtenerUbicacionActual();
      if (!ubicacion) {
        alert(this.errorUbicacion || 'No se pudo obtener la ubicación. Puedes ingresar las coordenadas manualmente.');
        return;
      }
      this.nuevoReporte.ubicacion.latitud = ubicacion.latitud;
      this.nuevoReporte.ubicacion.longitud = ubicacion.longitud;
    }

    const { latitud, longitud } = this.nuevoReporte.ubicacion;
    if (latitud == null || longitud == null || !Number.isFinite(latitud) || !Number.isFinite(longitud) ||
        latitud < -90 || latitud > 90 || longitud < -180 || longitud > 180) {
      this.errorUbicacion = 'No se pudo determinar una ubicación válida. Revisa la dirección o inténtalo de nuevo.';
      return;
    }

    if (!this.nuevoReporte.ubicacion.departamento || !this.nuevoReporte.ubicacion.municipio) {
      this.errorUbicacion = 'Completa el departamento y municipio para guardar el reporte.';
      return;
    }

    const payload = {
      titulo: this.nuevoReporte.titulo,
      descripcion: this.nuevoReporte.descripcion,
      usuario_id: this.authService.getCurrentUser()?.id,
      categoria_id: Number(this.nuevoReporte.categoria_id),
      ubicacion: {
        departamento: this.nuevoReporte.ubicacion.departamento,
        municipio: this.nuevoReporte.ubicacion.municipio,
        direccion: this.nuevoReporte.ubicacion.direccion || undefined,
        latitud,
        longitud
      }
    };

    if (!payload.usuario_id) {
      this.mensajeReporte = 'No se pudo identificar tu sesión. Vuelve a iniciar sesión e inténtalo de nuevo.';
      return;
    }

    this.guardandoReporte = true;
    this.mensajeReporte = 'Publicando reporte...';
    this.reporteService.crearReporte(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.guardandoReporte = false;
        this.mensajeReporte = 'Reporte publicado correctamente.';
        this.resetearFormulario();
        this.changeDetector.markForCheck();
      },
      error: (err: any) => {
        console.error('Error al guardar reporte:', err);
        this.guardandoReporte = false;
        this.mensajeReporte = err.error?.message || err.error?.error || 'No se pudo publicar el reporte. Inténtalo nuevamente.';
        this.changeDetector.markForCheck();
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

  normalizarEstadoBackend(estado?: string): string {
    const valor = (estado || 'pendiente').trim().toLowerCase();
    const map: Record<string, string> = {
      'pendiente': 'pendiente',
      'en proceso': 'en revision',
      'en revision': 'en revision',
      'en revisión': 'en revision',
      'verificado': 'verificado',
      'resuelto': 'resuelto',
      'rechazado': 'rechazado'
    };

    return map[valor] || 'pendiente';
  }

  formatearEstado(estado?: string): string {
    const valor = this.normalizarEstadoBackend(estado);
    const labels: Record<string, string> = {
      pendiente: 'Pendiente',
      'en revision': 'En revisión',
      verificado: 'Verificado',
      resuelto: 'Resuelto',
      rechazado: 'Rechazado'
    };

    return labels[valor] || 'Pendiente';
  }

  contarPorEstado(estado: string): number {
    if (!Array.isArray(this.reportes)) return 0;
    const valor = this.normalizarEstadoBackend(estado);
    return this.reportes.filter((r: any) => {
      const e = this.normalizarEstadoBackend(r.estado || r['estado'] || 'pendiente');
      return e === valor;
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
        direccion: '',
        latitud: null,
        longitud: null
      }
    };
    this.modoUbicacion = 'manual';
    this.errorUbicacion = null;
    this.direccionResuelta = null;
    this.actualizarMarcadorManual();
  }

  cambiarModoUbicacion(modo: 'manual' | 'automatica'): void {
    if (modo === this.modoUbicacion) return;

    this.solicitudGeocodificacion?.abort();
    this.buscandoDireccion = false;
    this.modoUbicacion = modo;
    this.errorUbicacion = null;
    this.direccionResuelta = null;
    this.nuevoReporte.ubicacion.direccion = '';
    this.nuevoReporte.ubicacion.departamento = '';
    this.nuevoReporte.ubicacion.municipio = '';
    this.nuevoReporte.ubicacion.latitud = null;
    this.nuevoReporte.ubicacion.longitud = null;
    this.actualizarMarcadorManual();

    if (modo === 'automatica') {
      void this.setUbicacionActual();
    }
  }

  async setUbicacionActual(): Promise<void> {
    this.errorUbicacion = null;
    const coords = await this.obtenerUbicacionActual();
    if (!coords || this.modoUbicacion !== 'automatica') {
      return;
    }

    this.nuevoReporte.ubicacion.latitud = coords.latitud;
    this.nuevoReporte.ubicacion.longitud = coords.longitud;
    this.changeDetector.markForCheck();
  }

  private direccionResuelta: string | null = null;
  private solicitudGeocodificacion?: AbortController;
  buscandoDireccion = false;

  async buscarDireccion(): Promise<void> {
    const direccion = this.nuevoReporte.ubicacion.direccion.trim();
    if (!direccion) {
      this.errorUbicacion = 'Escribe una dirección antes de buscarla en el mapa.';
      return;
    }

    await this.geocodificarDireccion(direccion);
  }

  private async geocodificarDireccion(direccion: string): Promise<boolean> {
    if (this.direccionResuelta !== direccion) {
      this.nuevoReporte.ubicacion.departamento = '';
      this.nuevoReporte.ubicacion.municipio = '';
      this.nuevoReporte.ubicacion.latitud = null;
      this.nuevoReporte.ubicacion.longitud = null;
    }
    this.solicitudGeocodificacion?.abort();
    const solicitud = new AbortController();
    this.solicitudGeocodificacion = solicitud;
    this.buscandoDireccion = true;
    this.errorUbicacion = null;
    this.changeDetector.markForCheck();

    try {
      const parametros = new URLSearchParams({
        format: 'jsonv2',
        addressdetails: '1',
        limit: '1',
        q: direccion
      });
      const respuesta = await fetch(`https://nominatim.openstreetmap.org/search?${parametros}`, {
        headers: { 'Accept-Language': 'es' },
        signal: solicitud.signal
      });
      if (!respuesta.ok) throw new Error('No se pudo consultar el servicio de direcciones.');

      const resultados = await respuesta.json() as ResultadoGeocodificacion[];
      const resultado = resultados[0];
      if (!resultado) {
        this.errorUbicacion = 'No encontramos esa dirección. Prueba con calle, número, municipio y departamento.';
        return false;
      }

      const latitud = Number(resultado.lat);
      const longitud = Number(resultado.lon);
      if (!Number.isFinite(latitud) || !Number.isFinite(longitud)) {
        this.errorUbicacion = 'La dirección no devolvió coordenadas válidas. Revisa la dirección e inténtalo de nuevo.';
        return false;
      }

      this.nuevoReporte.ubicacion.latitud = latitud;
      this.nuevoReporte.ubicacion.longitud = longitud;
      this.nuevoReporte.ubicacion.direccion = direccion;
      this.direccionResuelta = direccion;
      this.completarAreaAdministrativa(resultado.address);
      this.actualizarVistaMapa([latitud, longitud]);
      if (!this.nuevoReporte.ubicacion.departamento || !this.nuevoReporte.ubicacion.municipio) {
        this.errorUbicacion = 'No identificamos municipio y departamento. Añádelos a la dirección y vuelve a ubicarla.';
        return false;
      }
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return false;
      this.errorUbicacion = 'No se pudo buscar la dirección. Comprueba tu conexión e inténtalo de nuevo.';
      return false;
    } finally {
      if (this.solicitudGeocodificacion === solicitud) {
        this.buscandoDireccion = false;
        this.changeDetector.markForCheck();
      }
    }
  }

  obtenerUbicacionActual(): Promise<{ latitud: number; longitud: number } | null> {
    return new Promise((resolve) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        this.errorUbicacion = 'Este navegador no ofrece geolocalización. Puedes escribir una dirección exacta.';
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitud: position.coords.latitude,
            longitud: position.coords.longitude
          });
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            this.errorUbicacion = 'Se denegó el permiso de ubicación. Puedes escribir una dirección exacta.';
          } else if (error.code === error.TIMEOUT) {
            this.errorUbicacion = 'La ubicación tardó demasiado en obtenerse. Inténtalo de nuevo o escribe una dirección.';
          } else {
            this.errorUbicacion = 'No fue posible obtener la ubicación del dispositivo. Puedes escribir una dirección.';
          }
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
      );
    });
  }

  actualizarMarcadorManual(): void {
    if (!this.marcadorUbicacion) return;

    const coordenadas = this.obtenerCoordenadasValidas();
    if (coordenadas) {
      this.marcadorUbicacion.setLatLng(coordenadas);
      this.mapaUbicacion?.panTo(coordenadas, { animate: false });
    } else if (this.nuevoReporte.ubicacion.latitud == null && this.nuevoReporte.ubicacion.longitud == null) {
      this.marcadorUbicacion.setLatLng([14.6281, -90.5154]);
    }
  }

  private inicializarMapaUbicacion(elemento: HTMLDivElement): void {
    const coordenadas = this.obtenerCoordenadasValidas();
    const centro: L.LatLngTuple = coordenadas ?? [14.6281, -90.5154];
    this.mapaUbicacion = L.map(elemento).setView(centro, coordenadas ? 15 : 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.mapaUbicacion);

    this.marcadorUbicacion = L.marker(centro, { draggable: true }).addTo(this.mapaUbicacion);
    this.mapaUbicacion.on('click', (evento: L.LeafletMouseEvent) => {
      void this.establecerCoordenadasManuales(evento.latlng.lat, evento.latlng.lng);
    });
    this.marcadorUbicacion.on('dragend', () => {
      const posicion = this.marcadorUbicacion?.getLatLng();
      if (posicion) void this.establecerCoordenadasManuales(posicion.lat, posicion.lng);
    });

    setTimeout(() => this.mapaUbicacion?.invalidateSize(), 0);
  }

  private obtenerCoordenadasValidas(): L.LatLngTuple | null {
    const { latitud, longitud } = this.nuevoReporte.ubicacion;
    if (latitud == null || longitud == null || !Number.isFinite(latitud) || !Number.isFinite(longitud) ||
        latitud < -90 || latitud > 90 || longitud < -180 || longitud > 180) {
      return null;
    }
    return [latitud, longitud];
  }

  private actualizarVistaMapa(coordenadas: L.LatLngTuple): void {
    this.marcadorUbicacion?.setLatLng(coordenadas);
    this.mapaUbicacion?.setView(coordenadas, 16, { animate: false });
  }

  private completarAreaAdministrativa(direccion?: Record<string, string>): void {
    if (!direccion) return;
    this.nuevoReporte.ubicacion.departamento = direccion['state'] || direccion['region'] || direccion['province'] ||
      direccion['state_district'] || this.nuevoReporte.ubicacion.departamento;
    this.nuevoReporte.ubicacion.municipio = direccion['city'] || direccion['town'] || direccion['village'] ||
      direccion['municipality'] || direccion['county'] || this.nuevoReporte.ubicacion.municipio;
  }

  private async establecerCoordenadasManuales(latitud: number, longitud: number): Promise<void> {
    this.nuevoReporte.ubicacion.latitud = Number(latitud.toFixed(6));
    this.nuevoReporte.ubicacion.longitud = Number(longitud.toFixed(6));
    this.nuevoReporte.ubicacion.direccion = '';
    this.nuevoReporte.ubicacion.departamento = '';
    this.nuevoReporte.ubicacion.municipio = '';
    this.direccionResuelta = null;
    this.marcadorUbicacion?.setLatLng([latitud, longitud]);
    this.buscandoDireccion = true;
    this.errorUbicacion = null;

    try {
      this.solicitudGeocodificacion?.abort();
      const solicitud = new AbortController();
      this.solicitudGeocodificacion = solicitud;
      const parametros = new URLSearchParams({
        format: 'jsonv2',
        addressdetails: '1',
        lon: String(longitud)
      });
      parametros.set('lat', String(latitud));
      const respuesta = await fetch(`https://nominatim.openstreetmap.org/reverse?${parametros}`, {
        headers: { 'Accept-Language': 'es' },
        signal: solicitud.signal
      });
      if (!respuesta.ok) throw new Error('No se pudo consultar la dirección del punto.');

      const resultado = await respuesta.json() as ResultadoGeocodificacion;
      if (!resultado.display_name) {
        this.errorUbicacion = 'No encontramos una dirección para este punto. Escribe una dirección manualmente.';
        return;
      }

      this.nuevoReporte.ubicacion.direccion = resultado.display_name;
      this.direccionResuelta = resultado.display_name;
      this.completarAreaAdministrativa(resultado.address);
      if (!this.nuevoReporte.ubicacion.departamento || !this.nuevoReporte.ubicacion.municipio) {
        this.errorUbicacion = 'No identificamos municipio y departamento para este punto. Escribe una dirección más completa.';
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        this.errorUbicacion = 'No se pudo obtener la dirección de este punto. También puedes escribirla manualmente.';
      }
    } finally {
      this.buscandoDireccion = false;
      this.changeDetector.markForCheck();
    }
  }

  getBadgeClass(estado?: string): string {
    const valor = this.normalizarEstadoBackend(estado);
    switch (valor) {
      case 'resuelto': return 'badge-success';
      case 'en revision': return 'badge-warning';
      case 'pendiente': return 'badge-danger';
      case 'verificado': return 'badge-secondary';
      case 'rechazado': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  }

  onEstadoChange(id: number | undefined, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const nuevoEstado = this.normalizarEstadoBackend(select.value);

    if (!id) {
      return;
    }

    this.estadosGuardando[id] = true;
    this.erroresEstado[id] = false;
    this.mensajesEstado[id] = 'Guardando...';
    this.reporteService.actualizarEstado(id, nuevoEstado).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.estadosGuardando[id] = false;
        this.mensajesEstado[id] = 'Guardado correctamente.';
        this.changeDetector.markForCheck();
      },
      error: (err: any) => {
        console.error('Error al actualizar el estado:', err);
        this.estadosGuardando[id] = false;
        this.erroresEstado[id] = true;
        this.mensajesEstado[id] = err.error?.message || 'No se pudo actualizar. Inténtalo nuevamente.';
        this.changeDetector.markForCheck();
      }
    });
  }
}