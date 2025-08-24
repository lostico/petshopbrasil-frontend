import { HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  
  if (token) {
    request = addToken(request, token);
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !request.url.includes('/refresh')) {
        // Verificar se temos refreshToken (após seleção de clínica)
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          return handle401Error(request, next, authService, router);
        } else {
          // Se não há refreshToken, fazer logout imediato
          console.log('Erro 401 detectado - fazendo logout automático');
          authService.forceLogout();
          return throwError(() => error);
        }
      }
      return throwError(() => error);
    })
  );
}

function addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

function handle401Error(
  request: HttpRequest<any>, 
  next: HttpHandlerFn, 
  authService: AuthService, 
  router: Router
) {
  return authService.refreshToken().pipe(
    switchMap((response) => {
      return next(addToken(request, response.accessToken));
    }),
    catchError((error) => {
      // Se o refresh token também falhou, fazer logout imediato
      console.log('Refresh token falhou - fazendo logout automático');
      authService.forceLogout();
      return throwError(() => error);
    })
  );
}


