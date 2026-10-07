import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, finalize, of, shareReplay, tap, throwError } from 'rxjs';

export interface Reporte {
  id?: number;
  titulo: string;
  descripcion: string;
  estado?: string;
  usuario_id?: number;
  categoria_id?: number;
  categoria_nombre?: string;
  municipio?: string;
  departamento?: string;
  direccion?: string;
  usuario_nombre?: string;
  usuario_apellido?: string;
  fecha_creacion?: string | Date;
  [key: string]: any;
}

export interface Categoria {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private apiUrl = 'http://localhost:3000/api/reportes-ambientales';
  private categoriasUrl = 'http://localhost:3000/api/categorias';
  private reportesSubject = new BehaviorSubject<Reporte[] | null>(null);
  private reportesCargados = false;
  private solicitudReportes?: Observable<any>;
  private reportesCreadosDuranteCarga = new Map<number, Reporte>();

  readonly reportes$ = this.reportesSubject.asObservable();

  constructor(private http: HttpClient) {}

  obtenerReportes(): Observable<any> {
    if (this.reportesCargados) {
      return of({ data: this.reportesSubject.value ?? [] });
    }
    if (this.solicitudReportes) {
      return this.solicitudReportes;
    }

    const solicitud = this.http.get<any>(this.apiUrl).pipe(
      tap((respuesta) => {
        const reportes = this.fusionarReportes(this.extraerReportes(respuesta));
        this.reportesCargados = true;
        this.reportesSubject.next(reportes);
      }),
      finalize(() => {
        this.solicitudReportes = undefined;
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );
    this.solicitudReportes = solicitud;
    return solicitud;
  }

  getReportes(): Observable<any> {
    return this.obtenerReportes();
  }

  crearReporte(datos: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, datos).pipe(
      tap((respuesta) => {
        const creado = respuesta?.data ?? respuesta;
        this.insertarReporte({ ...datos, ...creado, usuario_id: creado?.usuario_id ?? datos.usuario_id });
      })
    );
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  actualizarEstado(id: number, estado: string): Observable<any> {
    const anterior = this.reportesSubject.value?.find((reporte) => Number(reporte.id) === Number(id));
    if (anterior) {
      this.actualizarReporteEnMemoria(id, { estado });
    }

    return this.http.patch<any>(`${this.apiUrl}/${id}/estado`, { estado }).pipe(
      tap((respuesta) => {
        const confirmado = respuesta?.data ?? respuesta;
        this.actualizarReporteEnMemoria(id, { ...confirmado, estado: confirmado?.estado ?? estado });
      }),
      catchError((error) => {
        if (anterior) {
          this.actualizarReporteEnMemoria(id, { estado: anterior.estado });
        }
        return throwError(() => error);
      })
    );
  }

  private extraerReportes(respuesta: any): Reporte[] {
    if (Array.isArray(respuesta)) return respuesta;
    if (Array.isArray(respuesta?.data)) return respuesta.data;
    if (Array.isArray(respuesta?.reportes)) return respuesta.reportes;
    return [];
  }

  private insertarReporte(reporte: Reporte): void {
    const actuales = this.reportesSubject.value ?? [];
    const id = Number(reporte.id);
    const indice = Number.isFinite(id) ? actuales.findIndex((actual) => Number(actual.id) === id) : -1;
    const siguientes = [...actuales];

    if (indice >= 0) {
      siguientes[indice] = { ...siguientes[indice], ...reporte };
    } else {
      siguientes.unshift(reporte);
    }

    if (!this.reportesCargados && Number.isFinite(id)) {
      this.reportesCreadosDuranteCarga.set(id, reporte);
    }
    this.reportesSubject.next(siguientes);
  }

  private fusionarReportes(reportes: Reporte[]): Reporte[] {
    const fusionados = [...reportes];
    for (const reporte of this.reportesCreadosDuranteCarga.values()) {
      const indice = fusionados.findIndex((actual) => Number(actual.id) === Number(reporte.id));
      if (indice >= 0) {
        fusionados[indice] = { ...fusionados[indice], ...reporte };
      } else {
        fusionados.unshift(reporte);
      }
    }
    this.reportesCreadosDuranteCarga.clear();
    return fusionados;
  }

  private actualizarReporteEnMemoria(id: number, cambios: Partial<Reporte>): void {
    const actuales = this.reportesSubject.value;
    if (!actuales) return;

    this.reportesSubject.next(actuales.map((reporte) =>
      Number(reporte.id) === Number(id) ? { ...reporte, ...cambios } : reporte
    ));
  }

  obtenerCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.categoriasUrl);
  }
}