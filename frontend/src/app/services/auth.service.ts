import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Usuario, AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/auth';

  private currentUserSubject = new BehaviorSubject<Usuario | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(credentials: { correo: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.success && res.data) {
          localStorage.setItem('ecotrack_token', res.data.token);
          localStorage.setItem('ecotrack_user', JSON.stringify(res.data.usuario));
          this.currentUserSubject.next(res.data.usuario);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('ecotrack_token');
    localStorage.removeItem('ecotrack_user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('ecotrack_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private getStoredUser(): Usuario | null {
    const user = localStorage.getItem('ecotrack_user');
    return user ? JSON.parse(user) : null;
  }
}