import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Concert {
  id?: number;
  date: string;
  city: string;
  venue: string;
  tour: string;
  duration: string;
  songs?: Song[];
  showSongs?: boolean;
}

export interface Song {
  id?: number;
  title?: string;
  name?: string;
  position?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ConcertService {
  private apiUrl = 'http://localhost:8080/api/concerts';
  private attendanceUrl = 'http://localhost:8080/api/attendances';

  constructor(private http: HttpClient) { }

  // Obtener todos los conciertos
  getAll(): Observable<Concert[]> {
    return this.http.get<Concert[]>(this.apiUrl);
  }

  // Obtener conciertos asistidos por usuario
  getAttendedByUser(userId: number): Observable<Concert[]> {
    return this.http.get<Concert[]>(`http://localhost:8080/api/users/${userId}/concerts`);
  }

  // Crear concierto
  create(concert: any): Observable<any> {
    return this.http.post(this.apiUrl, concert);
  }

  // Actualizar concierto
  update(id: number, concert: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, concert);
  }

  // Eliminar concierto
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Marcar asistencia
  markAttendance(userId: number, concertId: number): Observable<any> {
    return this.http.post(
      `${this.attendanceUrl}/user/${userId}/concert/${concertId}`, 
      {}, 
      { responseType: 'text' }
    );
  }

  // Eliminar asistencia
  removeAttendance(userId: number, concertId: number): Observable<any> {
    return this.http.delete(
      `${this.attendanceUrl}/user/${userId}/concert/${concertId}`, 
      { responseType: 'text' }
    );
  }
}