import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiEndpoints } from '../config/api-endpoints';

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed?: string;
  gender?: PetGender;
  birthDate?: string | Date;
  weight?: number;
  color?: string;
  microchip?: string;
  status: PetStatus;
  statusReason?: string;
  tutorId: string;
  tutor?: {
    id: string;
    name: string;
    cpf: string;
    phone?: string;
    email?: string;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
  _count?: {
    appointments: number;
    medicalRecords: number;
  };
}

export enum PetSpecies {
  DOG = 'DOG',
  CAT = 'CAT',
  BIRD = 'BIRD',
  FISH = 'FISH',
  RABBIT = 'RABBIT',
  HAMSTER = 'HAMSTER',
  OTHER = 'OTHER'
}

export enum PetGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export enum PetStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DECEASED = 'DECEASED',
  ADOPTED = 'ADOPTED',
  LOST = 'LOST',
  UNDER_TREATMENT = 'UNDER_TREATMENT',
  QUARANTINE = 'QUARANTINE'
}

export interface PetSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  species?: PetSpecies;
  gender?: PetGender;
  tutorId?: string;
}

export interface PetListResponse {
  data: Pet[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreatePetRequest {
  name: string;
  species: PetSpecies;
  breed?: string;
  gender?: PetGender;
  birthDate?: Date;
  weight?: number;
  color?: string;
  microchip?: string;
  tutorId: string;
}

export interface UpdatePetRequest {
  name?: string;
  species?: PetSpecies;
  breed?: string | null;
  gender?: PetGender | null;
  birthDate?: Date | null;
  weight?: number | null;
  color?: string | null;
  microchip?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class PetService {
  constructor(private http: HttpClient) {}

  // Get all pets with pagination and search
  getPets(params?: PetSearchParams): Observable<PetListResponse> {
    const queryParams: any = {};
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.search) queryParams.search = params.search;
    if (params?.species) queryParams.species = params.species;
    if (params?.gender) queryParams.gender = params.gender;
    if (params?.tutorId) queryParams.tutorId = params.tutorId;

    return this.http.get<PetListResponse>(ApiEndpoints.PETS.LIST, { params: queryParams });
  }

  // Get pet by ID
  getPetById(id: string): Observable<Pet> {
    return this.http.get<{ pet: Pet }>(ApiEndpoints.PETS.BY_ID(id))
      .pipe(
        map(response => response.pet)
      );
  }

  // Create new pet
  createPet(petData: CreatePetRequest): Observable<Pet> {
    return this.http.post<{ message: string; pet: Pet }>(ApiEndpoints.PETS.CREATE, petData)
      .pipe(
        map(response => response.pet)
      );
  }

  // Update pet
  updatePet(id: string, petData: UpdatePetRequest): Observable<Pet> {
    return this.http.put<{ message: string; pet: Pet }>(ApiEndpoints.PETS.UPDATE(id), petData)
      .pipe(
        map(response => response.pet)
      );
  }

  // Delete pet
  deletePet(id: string): Observable<any> {
    return this.http.delete(ApiEndpoints.PETS.DELETE(id));
  }

  // Get pets by owner (tutor específico)
  getPetsByOwner(ownerId: string): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${ApiEndpoints.PETS.LIST}/tutor`, {
      params: { tutorId: ownerId }
    });
  }

  // Search pets
  searchPets(query: string): Observable<Pet[]> {
    return this.http.get<Pet[]>(ApiEndpoints.PETS.SEARCH, {
      params: { q: query }
    });
  }

  // Deactivate pet
  deactivatePet(id: string): Observable<Pet> {
    return this.http.patch<{ message: string; pet: Pet }>(`${ApiEndpoints.PETS.BY_ID(id)}/deactivate`, {})
      .pipe(
        map(response => response.pet)
      );
  }

  // Reactivate pet
  reactivatePet(id: string): Observable<Pet> {
    return this.http.patch<{ message: string; pet: Pet }>(`${ApiEndpoints.PETS.BY_ID(id)}/reactivate`, {})
      .pipe(
        map(response => response.pet)
      );
  }

  // Update pet status
  updatePetStatus(id: string, status: PetStatus, reason?: string): Observable<Pet> {
    return this.http.patch<{ message: string; pet: Pet }>(`${ApiEndpoints.PETS.BY_ID(id)}/status`, {
      status,
      reason
    })
    .pipe(
      map(response => response.pet)
    );
  }
}
