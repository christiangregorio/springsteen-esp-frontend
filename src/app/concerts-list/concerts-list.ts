import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConcertReviewComponent } from '../concerts/concert-review/concert-review';
import { ConcertService, Concert, Song } from '../services/concert.service';

interface CurrentUser {
  id: number;
  email: string;
}

@Component({
  selector: 'app-concerts-list',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormsModule, 
    ConcertReviewComponent
  ],
  templateUrl: './concerts-list.html',
  styleUrls: ['./concerts-list.css']
})
export class ConcertsListComponent implements OnInit {
  
  form: FormGroup;
  concerts: Concert[] = [];
  attendedConcertIds: number[] = [];
  attendedConcerts: Concert[] = [];
  editMode = false;
  editConcertId: number | null = null;
  currentUser: CurrentUser | null = null;

  constructor(
    private fb: FormBuilder, 
    private concertService: ConcertService,
    private router: Router
  ) {
    this.form = this.fb.group({
      date: ['', Validators.required],
      city: ['', Validators.required],
      venue: ['', Validators.required],
      tour: ['', Validators.required],
      duration: ['', Validators.required],
      songs: this.fb.array([])
    });
  }

  get songs(): FormArray {
    return this.form.get('songs') as FormArray;
  }

  // Inicialización
  ngOnInit() {
    const userData = localStorage.getItem('currentUser');
    
    if (!userData) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = JSON.parse(userData);

    this.concerts = [];
    this.attendedConcerts = [];
    this.attendedConcertIds = [];
    this.editMode = false;
    this.editConcertId = null;
    this.form.reset();

    this.loadConcerts();
    this.loadAttendedConcerts();
  }

  // Carga de datos
  loadConcerts() {
    this.concertService.getAll().subscribe({
      next: (data: Concert[]) => {
        this.concerts = (data || []).map(c => ({ ...c, showSongs: false }));
      },
      error: (err: any) => console.error('Error cargando conciertos:', err)
    });
  }

  loadAttendedConcerts() {
    if (!this.currentUser) return;

    this.concertService.getAttendedByUser(this.currentUser.id).subscribe({
      next: (data: Concert[]) => {
        this.attendedConcerts = data || [];
        this.attendedConcertIds = (data || []).map(c => c.id!);
      },
      error: (err: any) => console.error('Error cargando conciertos asistidos:', err)
    });
  }

  // CRUD de conciertos
  submit() {
    if (!this.form.valid) {
      alert('⚠️ Completa todos los campos');
      return;
    }

    const payload = {
      date: this.form.value.date,
      city: this.form.value.city,
      venue: this.form.value.venue,
      tour: this.form.value.tour,
      duration: this.form.value.duration,
      songs: this.form.value.songs.length > 0 ? this.form.value.songs : []
    };

    if (this.editMode && this.editConcertId !== null) {
      this.concertService.update(this.editConcertId, payload).subscribe({
        next: () => {
          this.loadConcerts();
          this.resetForm();
          alert('✓ Concierto actualizado');
        },
        error: (err: any) => console.error('Error actualizando concierto:', err)
      });
    } else {
      this.concertService.create(payload).subscribe({
        next: () => {
          this.loadConcerts();
          this.resetForm();
          alert('✓ Concierto creado');
        },
        error: (err: any) => console.error('Error creando concierto:', err)
      });
    }
  }

  editConcert(concert: Concert) {
    this.editMode = true;
    this.editConcertId = concert.id || null;
    
    this.form.patchValue({
      date: concert.date,
      city: concert.city,
      venue: concert.venue,
      tour: concert.tour,
      duration: concert.duration
    });

    this.songs.clear();
    if (concert.songs && concert.songs.length > 0) {
      concert.songs.forEach((song: Song) => {
        const songGroup = this.fb.group({
          position: [song.position || 0, Validators.required],
          title: [song.title || song.name || '', Validators.required]
        });
        this.songs.push(songGroup);
      });
    }

    setTimeout(() => {
      document.getElementById('concert-form')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  }

  deleteConcert(id: number) {
    if (!confirm('¿Estás seguro de eliminar este concierto?')) return;
    
    this.concertService.delete(id).subscribe({
      next: () => {
        this.loadConcerts();
        alert('✓ Concierto eliminado');
      },
      error: (err: any) => console.error('Error borrando concierto:', err)
    });
  }

  resetForm() {
    this.editMode = false;
    this.editConcertId = null;
    this.form.reset();
    this.songs.clear();
  }

  // Gestión de canciones
  addSong() {
    const songGroup = this.fb.group({
      position: ['', Validators.required],
      title: ['', Validators.required]
    });
    this.songs.push(songGroup);
  }

  removeSong(index: number) {
    this.songs.removeAt(index);
  }

  toggleSongs(concert: Concert) {
    concert.showSongs = !concert.showSongs;
  }

  // Gestión de asistencia
  markAttendance(concertId: number) {
    if (!this.currentUser) return;

    this.concertService.markAttendance(this.currentUser.id, concertId).subscribe({
      next: () => {
        this.loadAttendedConcerts();
        this.loadConcerts();
        alert('✓ Asistencia marcada');
      },
      error: (err: any) => console.error('Error marcando asistencia:', err)
    });
  }

  removeAttendance(concertId: number) {
    if (!this.currentUser) return;

    this.concertService.removeAttendance(this.currentUser.id, concertId).subscribe({
      next: () => {
        this.loadAttendedConcerts();
        this.loadConcerts();
        alert('✓ Asistencia eliminada');
      },
      error: (err: any) => console.error('Error eliminando asistencia:', err)
    });
  }

  isAttended(concertId: number): boolean {
    return this.attendedConcertIds.includes(concertId);
  }
}