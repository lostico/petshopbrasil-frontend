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
          authService.logout();
          router.navigate(['/login']);
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
      authService.logout();
      router.navigate(['/login']);
      return throwError(() => error);
    })
  );
}


