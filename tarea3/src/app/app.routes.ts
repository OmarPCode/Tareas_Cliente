import { Routes } from '@angular/router';
import { RegistroComponent } from './registro/registro.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'registro' },
  { path: 'registro', component: RegistroComponent },
  { path: '**', redirectTo: 'registro' },
];