import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DatosImpacto {
  usuario_id?: number;
  transporte_km_semana: number;
  tipo_transporte: string;
  energia_kwh_mes: number;
  agua_m3_mes: number;
  residuos_kg_semana: number;
  recicla: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ImpactoService {
  private apiUrl = 'http://localhost:3000/api/impacto';

  constructor(private http: HttpClient) {}

  calcularImpacto(datos: DatosImpacto): Observable<any> {
    return this.http.post<any>(this.apiUrl, datos);
  }
}