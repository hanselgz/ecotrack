import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reporte {
  id?: number;
  titulo: string;
  descripcion: string;
  estado?: string;
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

  constructor(private http: HttpClient) {}

  obtenerReportes(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getReportes(): Observable<any> {
    return this.obtenerReportes();
  }

  crearReporte(datos: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, datos);
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  obtenerCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.categoriasUrl);
  }
}