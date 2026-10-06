import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ReporteAmbiental, ReporteInput, ApiResponse, Categoria } from '../models/reporte.model';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  // Obtener todos los reportes
  getReportes(): Observable<ReporteAmbiental[]> {
    return this.http.get<ApiResponse<ReporteAmbiental[]>>(`${this.apiUrl}/reports`).pipe(
      map(res => res.data)
    );
  }

  // Obtener un reporte por ID
  getReporteById(id: number): Observable<ReporteAmbiental> {
    return this.http.get<ApiResponse<ReporteAmbiental>>(`${this.apiUrl}/reports/${id}`).pipe(
      map(res => res.data)
    );
  }

  // Obtener categorias
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<ApiResponse<Categoria[]>>(`${this.apiUrl}/categories`).pipe(
      map(res => res.data)
    );
  }

  // Crear reporte
  crearReporte(reporte: ReporteInput): Observable<ApiResponse<ReporteAmbiental>> {
    return this.http.post<ApiResponse<ReporteAmbiental>>(`${this.apiUrl}/reports`, reporte);
  }

  // Actualizar estado
  actualizarEstado(id: number, estado: string): Observable<ApiResponse<ReporteAmbiental>> {
    return this.http.patch<ApiResponse<ReporteAmbiental>>(`${this.apiUrl}/reports/${id}/status`, { estado });
  }

  // Eliminar reporte
  eliminarReporte(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/reports/${id}`);
  }
}