import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  styleUrls: ['./login.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  
  // Propiedades
  form: FormGroup;
  private readonly apiUrl = 'http://localhost:8080/api/users/login';

  // Constructor
  constructor(
    private fb: FormBuilder, 
    private http: HttpClient, 
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  // Gestión de login
  submit() {
    if (!this.form.valid) {
      alert('⚠️ Completa todos los campos');
      return;
    }

    const { email, password } = this.form.value;

    this.http.post<{ message: string; email?: string; id?: number }>(this.apiUrl, { email, password })
      .subscribe({
        next: (response) => {
          if (response.message === 'login ok' && response.id) {
            localStorage.setItem('currentUser', JSON.stringify({
              id: response.id,
              email: response.email
            }));
            
            alert(`✓ Bienvenido, ${response.email}`);
            
            this.router.navigate(['/concerts']).then(() => {
              window.location.reload();
            });
          } else {
            alert('✗ Credenciales incorrectas');
          }
        },
        error: (err) => {
          console.error(err);
          alert('✗ Error al iniciar sesión');
        }
      });
  }
}