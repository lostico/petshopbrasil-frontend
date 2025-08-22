import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { MenuPermissionsService } from '../../services/menu-permissions.service';

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  badge?: string;
  children?: MenuItem[];
}

interface SelectedClinic {
  id: string;
  name: string;
  location: string;
  role: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div 
      class="fixed inset-y-0 left-0 z-50 bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col"
      [class.w-64]="!collapsed"
      [class.w-16]="collapsed"
    >
      <!-- Sidebar Header - Fixed at top -->
      <div class="flex-shrink-0 flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center" [class.mr-3]="!collapsed">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          @if (!collapsed) {
            <h1 class="text-lg font-semibold text-gray-900">PetShop Brasil</h1>
          }
        </div>
        
        <!-- Collapse/Expand Button -->
        <button
          (click)="toggleCollapse()"
          class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          [title]="collapsed ? 'Expandir menu' : 'Recolher menu'"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            @if (!collapsed) {
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            }
            @if (collapsed) {
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            }
          </svg>
        </button>
      </div>

      <!-- User Info - Fixed below header -->
      <div class="flex-shrink-0 px-4 py-3 border-b border-gray-200" [class.px-2]="collapsed">
        <div class="flex items-center" [class.justify-center]="collapsed">
          <div class="flex-shrink-0">
            <div class="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center" 
                 [title]="collapsed ? currentUser?.name : ''">
              <span class="text-white font-medium text-sm">
                {{ currentUser?.name?.charAt(0)?.toUpperCase() }}
              </span>
            </div>
          </div>
          @if (!collapsed) {
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">{{ currentUser?.name }}</p>
              <p class="text-xs text-gray-500">{{ currentUser?.email }}</p>
              @if (selectedClinic) {
                <p class="text-xs text-indigo-600 font-medium">
                  {{ selectedClinic.name }}
                </p>
              }
            </div>
          }
        </div>
      </div>

      <!-- Navigation Menu - Scrollable area -->
      <div class="flex-1 overflow-y-auto min-h-0">
        <nav class="px-2 py-4" [class.px-1]="collapsed">
          <div [class.space-y-6]="!collapsed" [class.space-y-2]="collapsed">
            @for (group of menuGroups; track group.title) {
              <!-- Group Title (only when expanded) -->
              @if (!collapsed) {
                <div class="px-3">
                  <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {{ group.title }}
                  </h3>
                </div>
              }
              
              <!-- Group Items -->
              <div class="space-y-1">
                @for (item of group.items; track item.route) {
                  <!-- Menu Item -->
                  <a
                    [routerLink]="item.route"
                    routerLinkActive="bg-indigo-50 border-indigo-500 text-indigo-700"
                    class="group flex items-center px-2 py-2 text-sm font-medium rounded-md border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 relative"
                    [class.justify-center]="collapsed"
                    [title]="collapsed ? item.label : ''"
                  >
                    <svg class="h-5 w-5" [class.mr-3]="!collapsed" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path [attr.d]="item.icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                    </svg>
                    @if (!collapsed) {
                      <span>{{ item.label }}</span>
                    }
                    @if (item.badge && !collapsed) {
                      <span class="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {{ item.badge }}
                      </span>
                    }
                    <!-- Badge for collapsed mode -->
                    @if (item.badge && collapsed) {
                      <span class="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
                    }
                  </a>
                }
              </div>
            }
          </div>
        </nav>
      </div>

      <!-- Logout Button - Fixed at bottom -->
      <div class="flex-shrink-0 p-4 border-t border-gray-200" [class.p-2]="collapsed">
        <button
          (click)="logout()"
          class="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          [class.justify-center]="collapsed"
          [title]="collapsed ? 'Sair' : ''"
        >
          <svg class="h-5 w-5" [class.mr-3]="!collapsed" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          @if (!collapsed) {
            <span>Sair</span>
          }
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();
  @Output() logoutEvent = new EventEmitter<void>();

  currentUser: User | null = null;
  selectedClinic: SelectedClinic | null = null;
  menuGroups: MenuGroup[] = [];

  constructor(
    private authService: AuthService,
    private menuPermissionsService: MenuPermissionsService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    console.info('currentUser', this.currentUser);
    this.loadSelectedClinic();
    this.loadSidebarState();
    this.initializeMenuGroups();
    this.filterMenuByPermissions();
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

  loadSidebarState(): void {
    const sidebarCollapsedState = localStorage.getItem('sidebarCollapsed');
    if (sidebarCollapsedState !== null) {
      this.collapsed = JSON.parse(sidebarCollapsedState);
    }
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    localStorage.setItem('sidebarCollapsed', JSON.stringify(this.collapsed));
    this.collapsedChange.emit(this.collapsed);
  }

  logout(): void {
    localStorage.removeItem('selectedClinic');
    localStorage.removeItem('sidebarCollapsed');
    this.logoutEvent.emit();
  }

  initializeMenuGroups(): void {
    this.menuGroups = [
      {
        title: 'Vendas & Atendimento',
        items: [
                     { label: 'PDV (Vendas Rápidas)', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01', route: '/pos', badge: '3' },
           { label: 'Pedidos & Orçamentos', icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', route: '/orders', badge: '12' },
          { label: 'Clientes', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', route: '/crm/customers' },
          { label: 'Pets', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', route: '/crm/pets' },
                     { label: 'Agendamentos', icon: 'M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-6 6m6-6l6 6m-6 6v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4m6 0h6m-6 0l-6-6m6 6l6-6', route: '/schedule', badge: '5' },
          { label: 'Check-in/Check-out', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', route: '/checkin' }
        ]
      },
      {
        title: 'Serviços',
        items: [
          { label: 'Banho & Tosa', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', route: '/grooming' },
          { label: 'Veterinário', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', route: '/vet' },
          { label: 'Internação', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', route: '/inpatient' },
          { label: 'Hotel', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z', route: '/hotel' }
        ]
      },
      {
        title: 'Produtos & Estoque',
        items: [
          { label: 'Catálogo de Produtos', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', route: '/catalog' },
                     { label: 'Controle de Estoque', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4', route: '/inventory', badge: '!' },
          { label: 'Compras & Fornecedores', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01', route: '/purchasing' }
        ]
      },
      {
        title: 'Financeiro',
        items: [
          { label: 'Caixa', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', route: '/finance/cash' },
          { label: 'Recebíveis', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1', route: '/finance/receivables' },
          { label: 'Pagamentos', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', route: '/finance/payables' }
        ]
      },
      {
        title: 'Relatórios',
        items: [
          { label: 'Dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z', route: '/dashboard' },
          { label: 'Relatórios Gerais', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', route: '/reports' }
        ]
      },
      {
        title: 'Configurações e Acesso',
        items: [
          { label: 'Empresa & Filiais', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', route: '/settings/org' },
          { label: 'Usuários & Papéis', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z', route: '/settings/users' },
          { label: 'Agenda & Regras', icon: 'M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-6 6m6-6l6 6m-6 6v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4m6 0h6m-6 0l-6-6m6 6l6-6', route: '/settings/schedule' },
          { label: 'Permissões & Acesso', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', route: '/settings/permissions' }
        ]
      }
    ];
  }

  filterMenuByPermissions(): void {
    this.menuGroups = this.menuPermissionsService.filterMenuItems(this.menuGroups);
  }
}
