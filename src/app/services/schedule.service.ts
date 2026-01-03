import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiEndpoints } from '../config/api-endpoints';

export interface TimelineSlot {
  time: string;
  date: string;
  available: boolean;
  reason?: string;
  appointment?: TimelineAppointment;
}

export interface TimelineAppointment {
  id: string;
  date: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS';
  notes?: string | null;
  pet: {
    id: string;
    name: string;
    species: string;
    breed: string;
  };
  clinicTutor: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  service: {
    id: string;
    name: string;
    category: string;
    duration: number;
    price: number;
  };
  vet: {
    id: string;
    name: string;
    email: string;
  };
  schedule: {
    id: string;
    name: string;
    color: string;
  };
}

export interface TimelineResponse {
  scheduleId: string;
  scheduleName: string;
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  timeInterval: number;
  workingHours: {
    start: string;
    end: string;
    breakStart?: string;
    breakEnd?: string;
  };
  slots: TimelineSlot[];
}

export interface TimelineParams {
  date?: string; // YYYY-MM-DD
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string; // YYYY-MM-DD
}

// Interfaces para a API de Schedules (Agendas)
export interface ScheduleDay {
  id: string;
  scheduleId: string;
  dayOfWeek: number; // 0-6, 0=domingo
  isActive: boolean;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  breakStart: string | null; // HH:mm
  breakEnd: string | null; // HH:mm
  maxAppointments: number | null;
}

export interface ScheduleService {
  id: string;
  scheduleId: string;
  serviceId: string;
  isActive: boolean;
  service: {
    id: string;
    name: string;
    category: string;
  };
}

export interface ScheduleSpecialty {
  id: string;
  scheduleId: string;
  specialty: string;
  isActive: boolean;
}

export interface ScheduleVet {
  id: string;
  name: string;
  email: string;
}

export interface Schedule {
  id: string;
  name: string;
  description: string | null;
  scheduleType: 'ORDEM_CHEGADA' | 'HORARIO_MARCADO';
  color: string;
  timeInterval: number;
  isActive: boolean;
  allowAppBooking: boolean;
  validFrom: string; // ISO 8601
  validUntil: string | null; // ISO 8601
  clinicId: string;
  vetId: string | null;
  category: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  vet: ScheduleVet | null;
  scheduleDays: ScheduleDay[];
  scheduleServices: ScheduleService[];
  scheduleSpecialties: ScheduleSpecialty[];
  _count: {
    appointments: number;
  };
}

export interface ScheduleFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  scheduleType?: 'ORDEM_CHEGADA' | 'HORARIO_MARCADO';
  vetId?: string;
  category?: string;
}

export interface ScheduleListResponse {
  schedules: Schedule[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateScheduleRequest {
  name: string;
  description?: string | null;
  scheduleType: 'ORDEM_CHEGADA' | 'HORARIO_MARCADO';
  color: string;
  timeInterval: number;
  isActive?: boolean;
  allowAppBooking?: boolean;
  validFrom: string; // ISO 8601
  validUntil?: string | null; // ISO 8601
  vetId?: string | null;
  category: string;
  scheduleDays: {
    dayOfWeek: number; // 0-6, 0=domingo
    isActive: boolean;
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    breakStart?: string | null; // HH:mm
    breakEnd?: string | null; // HH:mm
    maxAppointments?: number | null;
  }[];
  serviceIds?: string[];
  specialties?: string[];
}

export interface UpdateScheduleRequest {
  name?: string;
  description?: string | null;
  scheduleType?: 'ORDEM_CHEGADA' | 'HORARIO_MARCADO';
  color?: string;
  timeInterval?: number;
  isActive?: boolean;
  allowAppBooking?: boolean;
  validFrom?: string; // ISO 8601
  validUntil?: string | null; // ISO 8601
  vetId?: string | null;
  category?: string;
  scheduleDays?: {
    dayOfWeek: number; // 0-6, 0=domingo
    isActive: boolean;
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    breakStart?: string | null; // HH:mm
    breakEnd?: string | null; // HH:mm
    maxAppointments?: number | null;
  }[];
  scheduleServices?: Array<{
    serviceId: string;
    isActive: boolean;
  }>;
  scheduleSpecialties?: Array<{
    specialty: string;
    isActive: boolean;
  }>;
  // Mantido para compatibilidade com código existente
  serviceIds?: string[];
  specialties?: string[];
}

// Interfaces para horários disponíveis
export interface AvailableSlot {
  time: string; // HH:mm
  available: boolean;
  slot?: string; // Intervalo completo (ex: "08:00 - 08:30")
  reason?: string; // Motivo se não disponível ("Ocupado" ou "Intervalo")
}

export interface AvailableSlotsResponse {
  scheduleId: string;
  scheduleName: string;
  date: string; // YYYY-MM-DD
  scheduleType: string;
  timeInterval: number;
  workingHours: {
    start: string; // HH:mm
    end: string; // HH:mm
    breakStart?: string | null; // HH:mm
    breakEnd?: string | null; // HH:mm
  };
  totalSlots: number;
  availableSlots: AvailableSlot[];
  allSlots?: AvailableSlot[];
  available?: boolean; // false se agenda não funciona no dia
  reason?: string; // Motivo se não disponível
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  constructor(private http: HttpClient) {}

  /**
   * Busca a timeline de horários disponíveis e ocupados de uma agenda
   * @param scheduleId ID da agenda
   * @param params Parâmetros de filtro (date OU dateFrom + dateTo)
   */
  getTimeline(scheduleId: string, params: TimelineParams): Observable<TimelineResponse> {
    let httpParams = new HttpParams();

    if (params.date) {
      httpParams = httpParams.set('date', params.date);
    } else if (params.dateFrom && params.dateTo) {
      httpParams = httpParams.set('dateFrom', params.dateFrom);
      httpParams = httpParams.set('dateTo', params.dateTo);
    }

    return this.http.get<TimelineResponse>(ApiEndpoints.SCHEDULES.TIMELINE(scheduleId), {
      params: httpParams
    });
  }

  /**
   * Lista todas as agendas (não agendamentos) da clínica
   * @param filters Parâmetros de filtro opcionais
   */
  getSchedules(filters?: ScheduleFilters): Observable<ScheduleListResponse> {
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
    if (filters?.isActive !== undefined) {
      httpParams = httpParams.set('isActive', filters.isActive.toString());
    }
    if (filters?.scheduleType) {
      httpParams = httpParams.set('scheduleType', filters.scheduleType);
    }
    if (filters?.vetId) {
      httpParams = httpParams.set('vetId', filters.vetId);
    }
    if (filters?.category) {
      httpParams = httpParams.set('category', filters.category);
    }

    return this.http.get<ScheduleListResponse>(ApiEndpoints.SCHEDULES.LIST, {
      params: httpParams
    });
  }

  /**
   * Busca uma agenda por ID
   * @param id ID da agenda
   */
  getScheduleById(id: string): Observable<{ schedule: Schedule }> {
    return this.http.get<{ schedule: Schedule }>(ApiEndpoints.SCHEDULES.BY_ID(id));
  }

  /**
   * Cria uma nova agenda
   * @param scheduleData Dados da agenda
   */
  createSchedule(scheduleData: CreateScheduleRequest): Observable<{ message: string; schedule: Schedule }> {
    return this.http.post<{ message: string; schedule: Schedule }>(
      ApiEndpoints.SCHEDULES.CREATE,
      scheduleData
    );
  }

  /**
   * Atualiza uma agenda existente
   * @param id ID da agenda
   * @param scheduleData Dados atualizados da agenda
   */
  updateSchedule(id: string, scheduleData: UpdateScheduleRequest): Observable<{ message: string; schedule: Schedule }> {
    return this.http.put<{ message: string; schedule: Schedule }>(
      ApiEndpoints.SCHEDULES.UPDATE(id),
      scheduleData
    );
  }

  /**
   * Deleta uma agenda
   * @param id ID da agenda
   */
  deleteSchedule(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(ApiEndpoints.SCHEDULES.DELETE(id));
  }

  /**
   * Busca horários disponíveis para uma agenda e data
   * @param scheduleId ID da agenda
   * @param date Data no formato YYYY-MM-DD
   * @param serviceId ID do serviço (opcional)
   */
  getAvailableSlots(scheduleId: string, date: string, serviceId?: string): Observable<AvailableSlotsResponse> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('date', date);
    if (serviceId) {
      httpParams = httpParams.set('serviceId', serviceId);
    }

    return this.http.get<AvailableSlotsResponse>(ApiEndpoints.SCHEDULES.AVAILABLE_SLOTS(scheduleId), {
      params: httpParams
    });
  }
}

