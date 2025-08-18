import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

interface SelectedClinic {
  id: string;
  name: string;
  location: string;
  role: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <!-- Header -->
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-semibold text-gray-900">{{ environment.appName }}</h1>
              <span class="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ getEnvironmentBadge() }}
              </span>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-sm text-gray-700">
                Olá, {{ currentUser?.name }}
              </div>
              <div *ngIf="selectedClinic" class="text-sm text-gray-600">
                Clínica: {{ selectedClinic.name }}
              </div>
              <button
                (click)="logout()"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="border-4 border-dashed border-gray-200 rounded-lg h-96 p-6">
            <div class="text-center">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">
                Bem-vindo ao Dashboard!
              </h2>
              
              <div class="bg-white shadow rounded-lg p-6 max-w-md mx-auto">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Informações do Usuário</h3>
                <div class="space-y-2 text-sm text-gray-600">
                  <div><strong>Nome:</strong> {{ currentUser?.name }}</div>
                  <div><strong>Email:</strong> {{ currentUser?.email }}</div>
                  <div><strong>Função:</strong> {{ currentUser?.role }}</div>
                  <div><strong>Permissões:</strong></div>
                  <ul class="list-disc list-inside ml-4">
                    <li *ngFor="let permission of currentUser?.permissions">
                      {{ permission }}
                    </li>
                  </ul>
                </div>
              </div>

              <div *ngIf="selectedClinic" class="mt-8 bg-white shadow rounded-lg p-6 max-w-md mx-auto">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Clínica Selecionada</h3>
                <div class="space-y-2 text-sm text-gray-600">
                  <div><strong>Nome:</strong> {{ selectedClinic.name }}</div>
                  <div><strong>Localização:</strong> {{ selectedClinic.location }}</div>
                  <div><strong>Função:</strong> {{ selectedClinic.role }}</div>
                </div>
              </div>

              <div class="mt-8 bg-white shadow rounded-lg p-6 max-w-md mx-auto">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Informações do Ambiente</h3>
                <div class="space-y-2 text-sm text-gray-600">
                  <div><strong>Ambiente:</strong> {{ environment.appName }}</div>
                  <div><strong>API URL:</strong> {{ environment.apiUrl }}</div>
                  <div><strong>Produção:</strong> {{ environment.production ? 'Sim' : 'Não' }}</div>
                </div>
              </div>

              <div class="mt-8">
                <p class="text-gray-600">
                  Esta é a área protegida do sistema. Apenas usuários autenticados podem acessar esta página.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  selectedClinic: SelectedClinic | null = null;
  environment = environment;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadSelectedClinic();
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

  loadSelectedClinic(): void {
    const clinicData = localStorage.getItem('selectedClinic');
    if (clinicData) {
      try {
        this.selectedClinic = JSON.parse(clinicData);
      } catch (error) {
        console.error('Erro ao carregar dados da clínica:', error);
        localStorage.removeItem('selectedClinic');
      }
    }
  }

  logout(): void {
    // Limpar dados da clínica selecionada ao fazer logout
    localStorage.removeItem('selectedClinic');
    this.authService.logout().subscribe();
  }
}
