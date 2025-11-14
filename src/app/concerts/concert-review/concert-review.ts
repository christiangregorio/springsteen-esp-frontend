import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConcertReviewService } from '../../services/concert-review.service';

@Component({
  selector: 'app-concert-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './concert-review.html',
  styleUrls: ['./concert-review.css']
})
export class ConcertReviewComponent implements OnInit {
  @Input() concertId!: number;

  review: string = '';
  isEditing: boolean = false;
  reviewText: string = '';

  constructor(private reviewService: ConcertReviewService) {}

  ngOnInit() {
    this.loadReview();
  }

  loadReview() {
    this.reviewService.getReview(this.concertId).subscribe({
      next: (data) => {
        this.review = data.review;
      },
      error: () => {
        this.review = '';
      }
    });
  }

  startEditing() {
    this.isEditing = true;
    this.reviewText = this.review;
  }

  cancelEditing() {
    this.isEditing = false;
    this.reviewText = '';
  }

  save() {
    if (!this.reviewText.trim()) {
      alert('⚠️ El review no puede estar vacío');
      return;
    }

    this.reviewService.saveReview(this.concertId, this.reviewText).subscribe({
      next: () => {
        this.review = this.reviewText;
        this.isEditing = false;
        alert('✓ Review guardado');
      },
      error: (err) => {
        console.error('Error guardando review:', err);
        alert('✗ Error al guardar');
      }
    });
  }

  delete() {
    if (!confirm('¿Estás seguro de eliminar este review?')) {
      return;
    }

    this.reviewService.deleteReview(this.concertId).subscribe({
      next: () => {
        this.review = '';
        this.isEditing = false;
        alert('✓ Review eliminado');
      },
      error: (err) => {
        console.error('Error eliminando review:', err);
        alert('✗ Error al eliminar');
      }
    });
  }
}