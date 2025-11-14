import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ConcertReview {
  id?: string;
  concertId: number;
  review: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConcertReviewService {
  private readonly apiUrl = 'http://localhost:8080/api/concert-reviews';

  constructor(private http: HttpClient) {}

  // Obtener review de un concierto
  getReview(concertId: number): Observable<ConcertReview> {
    return this.http.get<ConcertReview>(`${this.apiUrl}/${concertId}`);
  }

  // Guardar o actualizar review
  saveReview(concertId: number, reviewText: string): Observable<ConcertReview> {
    return this.http.post<ConcertReview>(`${this.apiUrl}/${concertId}`, { review: reviewText });
  }

  // Eliminar review
  deleteReview(concertId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${concertId}`);
  }
}