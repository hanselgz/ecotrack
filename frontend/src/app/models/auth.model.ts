export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol_id?: number;
  rol_nombre?: string;
  puntuacion_ambiental?: number;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}