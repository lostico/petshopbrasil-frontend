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
    { route: '/dashboard', roles: ['ADMIN', 'VET', 'COLLABORATOR'] },
    
    // Vendas & Atendimento
    { route: '/pos', roles: ['ADMIN', 'COLLABORATOR'] },
    { route: '/orders', roles: ['ADMIN', 'COLLABORATOR'] },
    { route: '/crm/customers', roles: ['ADMIN', 'VET', 'COLLABORATOR'] },
    { route: '/crm/pets', roles: ['ADMIN', 'VET', 'COLLABORATOR'] },
    { route: '/schedule', roles: ['ADMIN', 'VET', 'COLLABORATOR'] },
    { route: '/checkin', roles: ['ADMIN', 'COLLABORATOR'] },
    
    // Serviços
    { route: '/grooming', roles: ['ADMIN', 'COLLABORATOR'] },
    { route: '/vet', roles: ['ADMIN', 'VET'] },
    { route: '/inpatient', roles: ['ADMIN', 'VET'] },
    { route: '/hotel', roles: ['ADMIN', 'COLLABORATOR'] },
    
    // Produtos & Estoque
    { route: '/catalog', roles: ['ADMIN', 'COLLABORATOR'] },
    { route: '/inventory', roles: ['ADMIN', 'COLLABORATOR'] },
    { route: '/purchasing', roles: ['ADMIN'] },
    
    // Financeiro
    { route: '/finance/cash', roles: ['ADMIN'] },
    { route: '/finance/receivables', roles: ['ADMIN'] },
    { route: '/finance/payables', roles: ['ADMIN'] },
    
    // Relatórios
    { route: '/reports', roles: ['ADMIN', 'VET'] },
    
                // Configurações
            { route: '/settings/org', roles: ['ADMIN'] },
            { route: '/settings/users', roles: ['ADMIN'] },
            { route: '/settings/schedule', roles: ['ADMIN'] },
            { route: '/settings/permissions', roles: ['ADMIN'] }
  ];

  constructor(private authService: AuthService) {}

  /**
   * Verifica se o usuário tem permissão para acessar uma rota específica
   */
  canAccess(route: string): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.role) {
      return false;
    }

    const permission = this.menuPermissions.find(p => p.route === route);
    if (!permission) {
      return false;
    }

    return permission.roles.includes(currentUser.role);
  }

  /**
   * Retorna todas as rotas que o usuário pode acessar
   */
  getAccessibleRoutes(): string[] {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.role) {
      return ['/dashboard'];
    }

    return this.menuPermissions
      .filter(p => currentUser.role && p.roles.includes(currentUser.role))
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
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.role || null;
  }

  /**
   * Verifica se o usuário é administrador
   */
  isAdmin(): boolean {
    const role = this.getCurrentUserRole();
    return role === 'ADMIN' || role === 'SUPER_ADMIN';
  }

  /**
   * Verifica se o usuário é veterinário
   */
  isVet(): boolean {
    const role = this.getCurrentUserRole();
    return role === 'VET';
  }

  /**
   * Verifica se o usuário é colaborador
   */
  isCollaborator(): boolean {
    const role = this.getCurrentUserRole();
    return role === 'COLLABORATOR';
  }
}
