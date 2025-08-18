import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ClinicSelectComponent } from './components/clinic-select/clinic-select.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { ClinicGuard } from './guards/clinic.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'clinic-select', 
    component: ClinicSelectComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard, ClinicGuard] 
  },
  { path: '**', redirectTo: '/login' }
];
