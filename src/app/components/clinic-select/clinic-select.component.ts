import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClinicService, UserClinic } from '../../services/clinic.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-clinic-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900">
            {{ environment.appName }}
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            Selecione uma clínica para continuar
          </p>
          <div class="mt-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {{ getEnvironmentBadge() }}
            </span>
          </div>
        </div>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div class="space-y-6">
            <!-- Loading State -->
            <div *ngIf="isLoading" class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p class="mt-4 text-sm text-gray-600">Carregando clínicas...</p>
            </div>

            <!-- Error State -->
            <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-800">{{ errorMessage }}</p>
                </div>
              </div>
            </div>

            <!-- Clinics List -->
            <div *ngIf="!isLoading && !errorMessage && userClinics.length > 0" class="space-y-4">
              <div class="text-center">
                <h3 class="text-lg font-medium text-gray-900">
                  Olá, {{ currentUser?.name }}!
                </h3>
                <p class="mt-1 text-sm text-gray-600">
                  Você tem acesso às seguintes clínicas:
                </p>
              </div>

              <div class="space-y-3">
                <div 
                  *ngFor="let userClinic of userClinics" 
                  class="relative border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                  [class.border-indigo-300]="selectedClinicId === userClinic.clinicId"
                  (click)="selectClinic(userClinic.clinicId)"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <h4 class="text-lg font-medium text-gray-900">
                        {{ userClinic.clinicName }}
                      </h4>
                      <div class="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {{ userClinic.role }}
                        </span>
                        <span *ngIf="userClinic.permissions.length > 0" class="text-gray-500">
                          {{ userClinic.permissions.length }} permissões
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <svg 
                        *ngIf="selectedClinicId === userClinic.clinicId"
                        class="h-6 w-6 text-indigo-600" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Continue Button -->
              <div class="pt-4">
                <button
                  type="button"
                  [disabled]="!selectedClinicId || isSelecting"
                  (click)="continueToDashboard()"
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div *ngIf="isSelecting" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Selecionando clínica...
                  </div>
                  <span *ngIf="!isSelecting">Continuar para o Dashboard</span>
                </button>
              </div>
            </div>

            <!-- No Clinics State -->
            <div *ngIf="!isLoading && !errorMessage && userClinics.length === 0" class="text-center">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhuma clínica encontrada</h3>
              <p class="mt-1 text-sm text-gray-500">
                Você não possui acesso a nenhuma clínica no momento.
              </p>
              <div class="mt-6">
                <button
                  type="button"
                  (click)="logout()"
                  class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Fazer Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ClinicSelectComponent implements OnInit {
  userClinics: UserClinic[] = [];
  selectedClinicId: string | null = null;
  isLoading = true;
  isSelecting = false;
  errorMessage = '';
  currentUser: any = null;
  environment = environment;

  constructor(
    private clinicService: ClinicService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadUserClinics();
  }

  getEnvironmentBadge(): string {
    if (environment.production) {
      return 'PRODUÇÃO';
    } else if (environment.appName.includes('QA')) {
      return 'QA';
    } else if (environment.appName.includes('Homologação')) {
      return 'HML';
    } else {
      return 'DEV';
    }
  }

  loadUserClinics(): void {
    this.isLoading = true;
    this.errorMessage = '';

    console.log('Iniciando carregamento de clínicas...');
    console.log('Token atual:', this.authService.getToken());

    this.clinicService.getUserClinics().subscribe({
      next: (clinics) => {
        console.log('Clínicas carregadas com sucesso:', clinics);
        this.userClinics = clinics.filter(clinic => clinic.isActive);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar clínicas:', error);
        this.errorMessage = error.error?.message || 'Erro ao carregar clínicas. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  selectClinic(clinicId: string): void {
    this.selectedClinicId = clinicId;
  }

  continueToDashboard(): void {
    if (!this.selectedClinicId) {
      return;
    }

    this.isSelecting = true;

    this.authService.selectClinic(this.selectedClinicId).subscribe({
      next: (response) => {
        this.isSelecting = false;
        // A clínica já foi armazenada pelo AuthService
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isSelecting = false;
        this.errorMessage = error.error?.message || 'Erro ao selecionar clínica. Tente novamente.';
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}
