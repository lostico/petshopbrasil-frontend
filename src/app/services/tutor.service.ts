import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Tutor {
  id: string;
  cpf: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  birthDate?: string;
  createdAt: string;
  updatedAt: string;
  tutor?: {
    id: string;
    cpf: string;
    name: string;
    email?: string;
    phone: string;
    pets?: Pet[];
  };
  _count?: {
    appointments: number;
    orders: number;
  };
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  color?: string;
  birthDate?: string;
  weight?: number;
  isActive: boolean;
}

export interface TutorsResponse {
  message: string;
  data: Tutor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface TutorSearchParams {
  page?: number;
  limit?: number;
  search?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TutorService {
  private apiUrl = `${environment.apiUrl}/tutors`;

  constructor(private http: HttpClient) {}

  // Listar tutores com paginação e busca
  getTutors(params: TutorSearchParams = {}): Observable<TutorsResponse> {
    let httpParams = new HttpParams();
    
    if (params.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    return this.http.get<TutorsResponse>(this.apiUrl, { params: httpParams });
  }

  // Buscar tutor por ID
  getTutorById(id: string): Observable<{ message: string; data: Tutor }> {
    return this.http.get<{ message: string; data: Tutor }>(`${this.apiUrl}/${id}`);
  }

  // Buscar tutor por CPF
  getTutorByCPF(cpf: string): Observable<{ message: string; data: Tutor }> {
    return this.http.get<{ message: string; data: Tutor }>(`${this.apiUrl}/cpf/${cpf}`);
  }

  // Criar novo tutor
  createTutor(tutorData: Partial<Tutor>): Observable<{ message: string; data: Tutor }> {
    return this.http.post<{ message: string; data: Tutor }>(this.apiUrl, tutorData);
  }

  // Atualizar tutor
  updateTutor(id: string, tutorData: Partial<Tutor>): Observable<{ message: string; data: Tutor }> {
    return this.http.put<{ message: string; data: Tutor }>(`${this.apiUrl}/${id}`, tutorData);
  }

  // Desativar tutor
  deactivateTutor(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
