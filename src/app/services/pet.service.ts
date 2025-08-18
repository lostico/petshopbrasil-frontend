import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiEndpoints } from '../config/api-endpoints';

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  ownerId: string;
  ownerName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePetRequest {
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  ownerId: string;
}

export interface UpdatePetRequest {
  name?: string;
  species?: string;
  breed?: string;
  age?: number;
  weight?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PetService {
  constructor(private http: HttpClient) {}

  // Get all pets
  getPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(ApiEndpoints.PETS.LIST);
  }

  // Get pet by ID
  getPetById(id: string): Observable<Pet> {
    return this.http.get<Pet>(ApiEndpoints.PETS.BY_ID(id));
  }

  // Create new pet
  createPet(petData: CreatePetRequest): Observable<Pet> {
    return this.http.post<Pet>(ApiEndpoints.PETS.CREATE, petData);
  }

  // Update pet
  updatePet(id: string, petData: UpdatePetRequest): Observable<Pet> {
    return this.http.put<Pet>(ApiEndpoints.PETS.UPDATE(id), petData);
  }

  // Delete pet
  deletePet(id: string): Observable<any> {
    return this.http.delete(ApiEndpoints.PETS.DELETE(id));
  }

  // Get pets by owner
  getPetsByOwner(ownerId: string): Observable<Pet[]> {
    return this.http.get<Pet[]>(ApiEndpoints.PETS.BY_OWNER(ownerId));
  }

  // Search pets
  searchPets(query: string): Observable<Pet[]> {
    return this.http.get<Pet[]>(ApiEndpoints.PETS.SEARCH, {
      params: { q: query }
    });
  }
}
