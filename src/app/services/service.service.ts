import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiEndpoints } from '../config/api-endpoints';

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category: ServiceCategory;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  _count?: {
    appointments: number;
    orderItems: number;
  };
}

export enum ServiceCategory {
  GROOMING = 'GROOMING',
  VACCINATION = 'VACCINATION',
  CONSULTATION = 'CONSULTATION',
  SURGERY = 'SURGERY',
  DENTAL = 'DENTAL',
  EMERGENCY = 'EMERGENCY',
  OTHER = 'OTHER'
}

export interface ServiceSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: ServiceCategory;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export interface ServiceListResponse {
  data: Service[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateServiceRequest {
  name: string;
  description?: string;
  price: number;
  duration: number;
  category: ServiceCategory;
  isActive?: boolean;
}

export interface UpdateServiceRequest {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  category?: ServiceCategory;
  isActive?: boolean;
}

export interface UpdateServiceStatusRequest {
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  constructor(private http: HttpClient) {}

  // Listar todos os serviços
  getAllServices(params: ServiceSearchParams = {}): Observable<ServiceListResponse> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const url = queryParams.toString() 
      ? `${ApiEndpoints.SERVICES.LIST}?${queryParams.toString()}`
      : ApiEndpoints.SERVICES.LIST;

    return this.http.get<ServiceListResponse>(url);
  }

  // Obter serviço por ID
  getServiceById(id: string): Observable<{ service: Service }> {
    return this.http.get<{ service: Service }>(ApiEndpoints.SERVICES.BY_ID(id));
  }

  // Criar novo serviço
  createService(serviceData: CreateServiceRequest): Observable<{ message: string; service: Service }> {
    return this.http.post<{ message: string; service: Service }>(
      ApiEndpoints.SERVICES.CREATE,
      serviceData
    );
  }

  // Atualizar serviço
  updateService(id: string, serviceData: UpdateServiceRequest): Observable<{ message: string; service: Service }> {
    return this.http.put<{ message: string; service: Service }>(
      ApiEndpoints.SERVICES.UPDATE(id),
      serviceData
    );
  }

  // Atualizar status do serviço
  updateServiceStatus(id: string, isActive: boolean): Observable<{ message: string; service: Service }> {
    return this.http.patch<{ message: string; service: Service }>(
      `${ApiEndpoints.SERVICES.BY_ID(id)}/status`,
      { isActive }
    );
  }

  // Deletar serviço
  deleteService(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(ApiEndpoints.SERVICES.DELETE(id));
  }

  // Obter serviços por categoria
  getServicesByCategory(category: ServiceCategory): Observable<Service[]> {
    return this.http.get<Service[]>(ApiEndpoints.SERVICES.BY_CATEGORY(category));
  }

  // Obter serviços ativos
  getActiveServices(): Observable<Service[]> {
    return this.getAllServices({ isActive: true }).pipe(
      map(response => response.data)
    );
  }

  // Buscar serviços por nome ou descrição
  searchServices(searchTerm: string): Observable<Service[]> {
    return this.getAllServices({ search: searchTerm }).pipe(
      map(response => response.data)
    );
  }

  // Obter categorias de serviço
  getServiceCategories(): ServiceCategory[] {
    return Object.values(ServiceCategory);
  }

  // Obter nome da categoria
  getCategoryName(category: ServiceCategory): string {
    const categoryNames: Record<ServiceCategory, string> = {
      [ServiceCategory.GROOMING]: 'Banho e Tosa',
      [ServiceCategory.VACCINATION]: 'Vacinação',
      [ServiceCategory.CONSULTATION]: 'Consulta',
      [ServiceCategory.SURGERY]: 'Cirurgia',
      [ServiceCategory.DENTAL]: 'Dental',
      [ServiceCategory.EMERGENCY]: 'Emergência',
      [ServiceCategory.OTHER]: 'Outros'
    };
    return categoryNames[category] || category;
  }

  // Formatar preço
  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  // Formatar duração
  formatDuration(duration: number): string {
    if (duration < 60) {
      return `${duration} min`;
    }
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}min`;
  }
}


