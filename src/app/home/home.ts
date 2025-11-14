import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  styleUrls: ['./home.css'],
  imports: [CommonModule, RouterOutlet],
  templateUrl: './home.html'
})
export class HomeComponent implements OnInit {
  showLogout = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkIfShowLogout();
  }

  checkIfShowLogout() {
    const user = localStorage.getItem('currentUser');
    const url = this.router.url;
    this.showLogout = !!user && url !== '/' && url !== '/login' && url !== '/register';
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  isLoginPage(): boolean {
    const url = this.router.url;
    return url === '/' || url === '/login';
  }

  isRegisterPage(): boolean {
    return this.router.url === '/register';
  }
}