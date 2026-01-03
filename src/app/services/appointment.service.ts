import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiEndpoints } from '../config/api-endpoints';

export interface Appointment {
  id: string;
  date: string; // ISO 8601
  time: string; // HH:mm
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED';
  notes?: string | null;
  petId: string;
  clinicTutorId: string;
  serviceId: string;
  scheduleId: string;
  vetId?: string | null;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  pet?: {
    id: string;
    name: string;
    species: string;
    breed: string;
  };
  clinicTutor?: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  service?: {
    id: string;
    name: string;
    category: string;
    duration: number;
    price: number;
  };
  schedule?: {
    id: string;
    name: string;
    color: string;
  };
  vet?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateAppointmentRequest {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  petId: string;
  clinicTutorId: string;
  serviceId: string;
  scheduleId: string;
  vetId?: string | null;
  notes?: string | null;
}

export interface UpdateAppointmentRequest {
  date?: string; // YYYY-MM-DD
  time?: string; // HH:mm
  petId?: string;
  clinicTutorId?: string;
  serviceId?: string;
  scheduleId?: string;
  vetId?: string | null;
  status?: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED';
  notes?: string | null;
}

export interface AppointmentFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  petId?: string;
  clinicTutorId?: string;
  serviceId?: string;
  scheduleId?: string;
  vetId?: string;
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string; // YYYY-MM-DD
}

export interface AppointmentListResponse {
  appointments: Appointment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}


@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  constructor(private http: HttpClient) {}

  /**
   * Lista todos os agendamentos
   * @param filters Parâmetros de filtro opcionais
   */
  getAppointments(filters?: AppointmentFilters): Observable<AppointmentListResponse> {
    let httpParams = new HttpParams();

    if (filters?.page) {
      httpParams = httpParams.set('page', filters.page.toString());
    }
    if (filters?.limit) {
      httpParams = httpParams.set('limit', filters.limit.toString());
    }
    if (filters?.search) {
      httpParams = httpParams.set('search', filters.search);
    }
    if (filters?.status) {
      httpParams = httpParams.set('status', filters.status);
    }
    if (filters?.petId) {
      httpParams = httpParams.set('petId', filters.petId);
    }
    if (filters?.clinicTutorId) {
      httpParams = httpParams.set('clinicTutorId', filters.clinicTutorId);
    }
    if (filters?.serviceId) {
      httpParams = httpParams.set('serviceId', filters.serviceId);
    }
    if (filters?.scheduleId) {
      httpParams = httpParams.set('scheduleId', filters.scheduleId);
    }
    if (filters?.vetId) {
      httpParams = httpParams.set('vetId', filters.vetId);
    }
    if (filters?.dateFrom) {
      httpParams = httpParams.set('dateFrom', filters.dateFrom);
    }
    if (filters?.dateTo) {
      httpParams = httpParams.set('dateTo', filters.dateTo);
    }

    return this.http.get<AppointmentListResponse>(ApiEndpoints.APPOINTMENTS.LIST, {
      params: httpParams
    });
  }

  /**
   * Busca um agendamento por ID
   * @param id ID do agendamento
   */
  getAppointmentById(id: string): Observable<{ appointment: Appointment }> {
    return this.http.get<{ appointment: Appointment }>(ApiEndpoints.APPOINTMENTS.BY_ID(id));
  }

  /**
   * Cria um novo agendamento
   * @param appointmentData Dados do agendamento
   */
  createAppointment(appointmentData: CreateAppointmentRequest): Observable<{ message: string; appointment: Appointment }> {
    return this.http.post<{ message: string; appointment: Appointment }>(
      ApiEndpoints.APPOINTMENTS.CREATE,
      appointmentData
    );
  }

  /**
   * Atualiza um agendamento existente
   * @param id ID do agendamento
   * @param appointmentData Dados atualizados do agendamento
   */
  updateAppointment(id: string, appointmentData: UpdateAppointmentRequest): Observable<{ message: string; appointment: Appointment }> {
    return this.http.put<{ message: string; appointment: Appointment }>(
      ApiEndpoints.APPOINTMENTS.UPDATE(id),
      appointmentData
    );
  }

  /**
   * Deleta um agendamento
   * @param id ID do agendamento
   */
  deleteAppointment(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(ApiEndpoints.APPOINTMENTS.DELETE(id));
  }
}

