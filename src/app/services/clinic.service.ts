import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiEndpoints } from '../config/api-endpoints';

export interface Clinic {
  id: string;
  name: string;
  cnpj: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserClinic {
  clinicId: string;
  clinicName: string;
  role: string;
  permissions: string[];
  isActive: boolean;
}

export interface SelectClinicRequest {
  clinicId: string;
}

export interface SelectClinicResponse {
  success: boolean;
  message: string;
  selectedClinic: Clinic;
}

@Injectable({
  providedIn: 'root'
})
export class ClinicService {
  constructor(private http: HttpClient) {}

  // Get all clinics
  getClinics(): Observable<Clinic[]> {
    return this.http.get<Clinic[]>(ApiEndpoints.CLINICS.LIST);
  }

  // Get clinic by ID
  getClinicById(id: string): Observable<Clinic> {
    return this.http.get<Clinic>(ApiEndpoints.CLINICS.BY_ID(id));
  }

  // Get user's associated clinics
  getUserClinics(): Observable<UserClinic[]> {
    return this.http.get<UserClinic[]>(ApiEndpoints.CLINICS.BY_USER);
  }

  // Select a clinic
  selectClinic(clinicId: string): Observable<SelectClinicResponse> {
    const request: SelectClinicRequest = { clinicId };
    return this.http.post<SelectClinicResponse>(ApiEndpoints.CLINICS.SELECT, request);
  }

  // Create new clinic
  createClinic(clinicData: Partial<Clinic>): Observable<Clinic> {
    return this.http.post<Clinic>(ApiEndpoints.CLINICS.CREATE, clinicData);
  }

  // Update clinic
  updateClinic(id: string, clinicData: Partial<Clinic>): Observable<Clinic> {
    return this.http.put<Clinic>(ApiEndpoints.CLINICS.UPDATE(id), clinicData);
  }

  // Delete clinic
  deleteClinic(id: string): Observable<any> {
    return this.http.delete(ApiEndpoints.CLINICS.DELETE(id));
  }

  // Search clinics
  searchClinics(query: string): Observable<Clinic[]> {
    return this.http.get<Clinic[]>(ApiEndpoints.CLINICS.SEARCH, {
      params: { q: query }
    });
  }
}
