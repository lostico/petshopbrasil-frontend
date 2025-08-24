import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      // Se o usuário está logado, redireciona para o dashboard
      this.router.navigate(['/dashboard']);
      return false;
    }
    
    // Se não está logado, permite acesso à página de login
    return true;
  }
}
