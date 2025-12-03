import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiEndpoints } from '../config/api-endpoints';

export enum VaccineType {
  CORE = 'CORE',
  NON_CORE = 'NON_CORE',
  ANNUAL = 'ANNUAL',
  BOOSTER = 'BOOSTER'
}

export enum Species {
  DOG = 'DOG',
  CAT = 'CAT',
  BIRD = 'BIRD',
  FISH = 'FISH',
  RABBIT = 'RABBIT',
  HAMSTER = 'HAMSTER',
  OTHER = 'OTHER'
}

export interface Vaccine {
  id: string;
  name: string;
  description: string | null;
  type: VaccineType;
  species: Species[];
  manufacturer: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    vaccinations: number;
  };
}

export interface VaccineSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: VaccineType;
  species?: Species;
  isActive?: boolean;
}

export interface VaccineListResponse {
  data: Vaccine[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateVaccineRequest {
  name: string;
  description?: string | null;
  type: VaccineType;
  species: Species[];
  manufacturer?: string | null;
  isActive?: boolean;
}

export interface UpdateVaccineRequest {
  name?: string;
  description?: string | null;
  type?: VaccineType;
  species?: Species[];
  manufacturer?: string | null;
  isActive?: boolean;
}

export interface DeleteVaccineResponse {
  message: string;
  vaccine?: Vaccine;
}

@Injectable({
  providedIn: 'root'
})
export class VaccineService {
  constructor(private http: HttpClient) {}

  // Listar todas as vacinas
  getAllVaccines(params: VaccineSearchParams = {}): Observable<VaccineListResponse> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const url = queryParams.toString() 
      ? `${ApiEndpoints.VACCINES.LIST}?${queryParams.toString()}`
      : ApiEndpoints.VACCINES.LIST;

    return this.http.get<VaccineListResponse>(url);
  }

  // Obter vacina por ID
  getVaccineById(id: string): Observable<{ vaccine: Vaccine }> {
    return this.http.get<{ vaccine: Vaccine }>(ApiEndpoints.VACCINES.BY_ID(id));
  }

  // Criar nova vacina
  createVaccine(vaccineData: CreateVaccineRequest): Observable<{ message: string; vaccine: Vaccine }> {
    return this.http.post<{ message: string; vaccine: Vaccine }>(
      ApiEndpoints.VACCINES.CREATE,
      vaccineData
    );
  }

  // Atualizar vacina
  updateVaccine(id: string, vaccineData: UpdateVaccineRequest): Observable<{ message: string; vaccine: Vaccine }> {
    return this.http.put<{ message: string; vaccine: Vaccine }>(
      ApiEndpoints.VACCINES.UPDATE(id),
      vaccineData
    );
  }

  // Atualizar status da vacina (inativar/reativar)
  updateVaccineStatus(id: string, isActive: boolean): Observable<{ message: string; vaccine: Vaccine }> {
    return this.http.put<{ message: string; vaccine: Vaccine }>(
      ApiEndpoints.VACCINES.UPDATE(id),
      { isActive }
    );
  }

  // Deletar vacina
  deleteVaccine(id: string): Observable<DeleteVaccineResponse> {
    return this.http.delete<DeleteVaccineResponse>(ApiEndpoints.VACCINES.DELETE(id));
  }

  // Obter nome do tipo de vacina
  getTypeName(type: VaccineType): string {
    const typeNames: Record<VaccineType, string> = {
      [VaccineType.CORE]: 'Essencial',
      [VaccineType.NON_CORE]: 'Não Essencial',
      [VaccineType.ANNUAL]: 'Anual',
      [VaccineType.BOOSTER]: 'Reforço'
    };
    return typeNames[type] || type;
  }

  // Obter nome da espécie
  getSpeciesName(species: Species): string {
    const speciesNames: Record<Species, string> = {
      [Species.DOG]: 'Cão',
      [Species.CAT]: 'Gato',
      [Species.BIRD]: 'Ave',
      [Species.FISH]: 'Peixe',
      [Species.RABBIT]: 'Coelho',
      [Species.HAMSTER]: 'Hamster',
      [Species.OTHER]: 'Outro'
    };
    return speciesNames[species] || species;
  }

  // Obter todos os tipos de vacina
  getVaccineTypes(): VaccineType[] {
    return Object.values(VaccineType);
  }

  // Obter todas as espécies
  getSpecies(): Species[] {
    return Object.values(Species);
  }
}

