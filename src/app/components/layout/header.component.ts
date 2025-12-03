import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';

interface SelectedClinic {
  id: string;
  name: string;
  location: string;
  role: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="flex items-center justify-between px-4 py-1 sm:px-6 lg:px-8">
        <!-- Left side -->
        <div class="flex items-center space-x-4">
          
        </div>

        <!-- Right side -->
        <div class="flex items-center space-x-4">

          <!-- User Menu -->
          <div class="relative">
            <button
              (click)="toggleUserMenu()"
              class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100"
            >
              <div class="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <span class="text-white font-medium text-sm">
                  {{ currentUser?.name?.charAt(0)?.toUpperCase() }}
                </span>
              </div>
              <div class="hidden md:block text-left">
                <p class="text-sm font-medium text-gray-900">{{ currentUser?.name }}</p>
                <p class="text-xs text-gray-500">{{ selectedClinic?.name }}</p>
              </div>
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- User Dropdown -->
            <div
              *ngIf="userMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
            >
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Perfil
              </a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Configurações
              </a>
              <div class="border-t border-gray-100"></div>
              <button
                (click)="logout()"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: []
})
export class HeaderComponent {
  @Output() logoutEvent = new EventEmitter<void>();

  currentUser: User | null = null;
  selectedClinic: SelectedClinic | null = null;
  userMenuOpen = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadSelectedClinic();
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

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout(): void {
    this.userMenuOpen = false;
    this.logoutEvent.emit();
  }
}
