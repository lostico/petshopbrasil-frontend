import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClinicGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const selectedClinic = localStorage.getItem('selectedClinic');
    
    if (!selectedClinic) {
      // Se não há clínica selecionada, redirecionar para seleção
      this.router.navigate(['/clinic-select']);
      return false;
    }

    return true;
  }
}
