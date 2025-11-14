import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-register', 
  styleUrls: ["./register.css"],
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html'
})
export class RegisterComponent {
  form: FormGroup;
  private readonly apiUrl = 'http://localhost:8080/api/users';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private location: Location) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  submit() {
    const { username, email, password, confirmPassword } = this.form.value;

    if (!this.form.valid) {
      alert('⚠️ Completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      alert('⚠️ Las contraseñas no coinciden');
      return;
    }

    // POST directo a /api/users con username, email y password
    this.http.post(this.apiUrl, { username, email, password })
      .subscribe({
        next: () => {
          alert('✓ Usuario registrado');
          this.router.navigate(['/']); // Redirige al login tras registrar
        },
        error: err => {
          console.error(err);
          alert('✗ Error al registrar: ' + (err.error?.message || err.message));
        }
      });
  }

  goBack() {
    this.location.back();
  }
}