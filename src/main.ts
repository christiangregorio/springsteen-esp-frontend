// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

// Componentes
import { HomeComponent } from './app/home/home';
import { LoginComponent } from './app/login/login';
import { RegisterComponent } from './app/register/register';
import { ConcertsListComponent } from './app/concerts-list/concerts-list';

// Rutas HomeComponent como layout principal
const routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'concerts', component: ConcertsListComponent }
    ]
  }
];

bootstrapApplication(HomeComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes)
  ]
});