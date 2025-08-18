import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ApiEndpoints } from '../config/api-endpoints';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: string;
    cpf: string;
    name: string;
    email: string;
    role: string;
    permissions: string[];
  };
  associations: any[];
  tempToken: string;
  requiresClinicSelection: boolean;
}

export interface SelectClinicResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    cpf: string;
    phone: string;
    address: string;
    isActive: boolean;
  };
  selectedClinic: {
    id: string;
    name: string;
    location: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface User {
  id: string;
  cpf: string;
  name: string;
  email: string;
  role?: string;
  permissions?: string[];
  phone?: string;
  address?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const user = localStorage.getItem('currentUser');
    const token = this.getToken();
    
    if (user && token) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(ApiEndpoints.AUTH.LOGIN, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('accessToken', response.tempToken);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.post(ApiEndpoints.AUTH.LOGOUT, {}, { headers })
      .pipe(
        tap(() => {
          this.clearAuthData();
          this.router.navigate(['/login']);
        })
      );
  }

  refreshToken(): Observable<{ accessToken: string }> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<{ accessToken: string }>(ApiEndpoints.AUTH.REFRESH, { refreshToken })
      .pipe(
        tap(response => {
          localStorage.setItem('accessToken', response.accessToken);
        })
      );
  }



  getProfile(): Observable<User> {
    return this.http.get<User>(ApiEndpoints.AUTH.PROFILE);
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(ApiEndpoints.AUTH.PROFILE, userData);
  }

  changePassword(passwordData: { currentPassword: string; newPassword: string }): Observable<any> {
    return this.http.put(ApiEndpoints.AUTH.CHANGE_PASSWORD, passwordData);
  }

  selectClinic(clinicId: string): Observable<SelectClinicResponse> {
    return this.http.post<SelectClinicResponse>(ApiEndpoints.AUTH.SELECT_CLINIC, { clinicId })
      .pipe(
        tap(response => {
          // Substituir o token temporário pelos tokens definitivos
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('selectedClinic', JSON.stringify(response.selectedClinic));
          
          // Atualizar dados do usuário se necessário
          if (response.user) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(ApiEndpoints.AUTH.USERS);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(ApiEndpoints.AUTH.USER_BY_ID(id));
  }

  updateUser(id: string, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(ApiEndpoints.AUTH.USER_BY_ID(id), userData);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(ApiEndpoints.AUTH.USER_BY_ID(id));
  }

  getToken(): string | null {
    const token = localStorage.getItem('accessToken');
    console.log('Token recuperado:', token ? 'Token presente' : 'Token não encontrado');
    return token;
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.currentUserSubject.value;
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.permissions?.includes(permission) || false;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }

  private clearAuthData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('selectedClinic'); // Limpar dados da clínica selecionada
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
