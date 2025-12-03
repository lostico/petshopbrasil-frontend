import { Injectable } from '@angular/core';
import { AuthService, User } from './auth.service';

export interface MenuPermission {
  route: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MenuPermissionsService {
  
  // Definição das permissões por rota
  private menuPermissions: MenuPermission[] = [
    // Dashboard - todos podem acessar
    { route: '/dashboard', roles: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'VET', 'STAFF', 'CLIENT'] },
    
    // Vendas & Atendimento
    { route: '/pos', roles: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'STAFF'] },
    { route: '/crm/customers', roles: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'VET', 'STAFF'] },
    { route: '/crm/pets', roles: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'VET', 'STAFF'] },
    { route: '/schedule', roles: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'VET', 'STAFF'] },
    { route: '/checkin', roles: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'STAFF'] },
    
    // Serviços
    { route: '/services', roles: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'VET'] },
    { route: '/services/new', roles: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'VET'] },
    { route: '/grooming', roles: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'STAFF'] },
    { route: '/vet', roles: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'VET'] },
    { route: '/inpatient', roles: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'VET'] },
    { route: '/hotel', roles: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'STAFF'] },
    
    // Cadastros
    { route: '/vaccines', roles: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'VET'] },
    { route: '/vaccines/new', roles: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'VET'] },
    { route: '/vaccines/:id', roles: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'VET'] },
    { route: '/vaccines/:id/edit', roles: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'VET'] },
    
    // Produtos & Estoque
    { route: '/catalog', roles: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'STAFF'] },
    { route: '/inventory', roles: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'STAFF'] },
    { route: '/purchasing', roles: ['SUPER_ADMIN', 'CLINIC_ADMIN'] },
    
    // Financeiro
    { route: '/finance/cash', roles: ['SUPER_ADMIN', 'CLINIC_ADMIN'] },
    { route: '/finance/receivables', roles: ['SUPER_ADMIN', 'CLINIC_ADMIN'] },
    { route: '/finance/payables', roles: ['SUPER_ADMIN', 'CLINIC_ADMIN'] },
    
    // Relatórios
    { route: '/reports', roles: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'VET'] },
    
    // Configurações
    { route: '/settings/org', roles: ['SUPER_ADMIN'] },
    { route: '/settings/users', roles: ['SUPER_ADMIN', 'CLINIC_ADMIN'] },
    { route: '/settings/schedule', roles: ['SUPER_ADMIN', 'CLINIC_ADMIN'] },
    { route: '/settings/permissions', roles: ['SUPER_ADMIN'] }
  ];

  constructor(private authService: AuthService) {}

  /**
   * Verifica se o usuário tem permissão para acessar uma rota específica
   */
  canAccess(route: string): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return false;
    }

    // Buscar role do token JWT
    const userRole = this.getUserRoleFromToken();
    console.info('userRole', userRole);
    if (!userRole) {
      return false;
    }

    const permission = this.menuPermissions.find(p => p.route === route);
    if (!permission) {
      return false;
    }

    return permission.roles.includes(userRole);
  }

  /**
   * Retorna todas as rotas que o usuário pode acessar
   */
  getAccessibleRoutes(): string[] {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return ['/dashboard'];
    }

    const userRole = this.getUserRoleFromToken();
    if (!userRole) {
      return ['/dashboard'];
    }
    
    return this.menuPermissions
      .filter(p => p.roles.includes(userRole))
      .map(p => p.route);
  }

  /**
   * Filtra itens de menu baseado nas permissões do usuário
   */
  filterMenuItems(menuItems: any[]): any[] {
    return menuItems.filter(item => {
      if (item.items) {
        // Se é um grupo, filtra os itens do grupo
        const filteredItems = this.filterMenuItems(item.items);
        return filteredItems.length > 0;
      } else {
        // Se é um item individual, verifica permissão
        return this.canAccess(item.route);
      }
    }).map(item => {
      if (item.items) {
        // Retorna o grupo com itens filtrados
        return {
          ...item,
          items: this.filterMenuItems(item.items)
        };
      }
      return item;
    });
  }

  /**
   * Retorna o papel do usuário atual
   */
  getCurrentUserRole(): string | null {
    return this.getUserRoleFromToken();
  }

  /**
   * Verifica se o usuário é super administrador
   */
  isSuperAdmin(): boolean {
    const role = this.getCurrentUserRole();
    return role === 'SUPER_ADMIN';
  }

  /**
   * Verifica se o usuário é administrador da clínica
   */
  isClinicAdmin(): boolean {
    const role = this.getCurrentUserRole();
    return role === 'CLINIC_ADMIN';
  }

  /**
   * Verifica se o usuário é veterinário
   */
  isVet(): boolean {
    const role = this.getCurrentUserRole();
    return role === 'VET';
  }

  /**
   * Verifica se o usuário é staff
   */
  isStaff(): boolean {
    const role = this.getCurrentUserRole();
    return role === 'STAFF';
  }

  /**
   * Verifica se o usuário é cliente
   */
  isClient(): boolean {
    const role = this.getCurrentUserRole();
    return role === 'CLIENT';
  }

  /**
   * Verifica se o usuário é administrador (super ou clínica)
   */
  isAdmin(): boolean {
    const role = this.getCurrentUserRole();
    return role === 'SUPER_ADMIN' || role === 'CLINIC_ADMIN';
  }

  /**
   * Decodifica o token JWT e extrai a role do usuário
   */
  private getUserRoleFromToken(): string | null {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return null;
    }

    try {
      // Decodificar o token JWT (payload)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles = payload['https://petshop.com/roles'];
      
      // Retorna a primeira role se existir, ou null se a lista estiver vazia
      if (Array.isArray(roles) && roles.length > 0) {
        return roles[0];
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }
}
