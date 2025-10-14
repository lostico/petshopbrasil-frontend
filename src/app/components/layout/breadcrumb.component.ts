import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface BreadcrumbItem {
  label: string;
  url: string;
  active: boolean;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="flex items-center space-x-2">
        <li>
          <a 
            routerLink="/dashboard" 
            class="text-gray-400 hover:text-gray-500 flex items-center"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
            <span class="sr-only">Dashboard</span>
          </a>
        </li>
        
        <ng-container *ngFor="let item of breadcrumbs; let last = last">
          <li>
            <div class="flex items-center">
              <svg class="h-4 w-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              <a 
                *ngIf="!last; else lastItem"
                [routerLink]="item.url"
                class="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                {{ item.label }}
              </a>
              <ng-template #lastItem>
                <span class="ml-2 text-sm font-medium text-gray-900">
                  {{ item.label }}
                </span>
              </ng-template>
            </div>
          </li>
        </ng-container>
      </ol>
    </nav>
  `,
  styles: []
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: BreadcrumbItem[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
      });
  }

  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: BreadcrumbItem[] = []): BreadcrumbItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = this.getBreadcrumbLabel(child.snapshot.data, child.snapshot.url);
      if (label) {
        breadcrumbs.push({
          label,
          url,
          active: false
        });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  private getBreadcrumbLabel(data: any, url: any[]): string {
    if (data && data['breadcrumb']) {
      return data['breadcrumb'];
    }

    // Mapeamento de rotas para labels
    const routeLabels: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'pos': 'PDV',
      'crm': 'CRM',
      'customers': 'Clientes',
      'pets': 'Pets',
      'schedule': 'Agendamentos',
      'grooming': 'Banho & Tosa',
      'vet': 'Veterinário',
      'inpatient': 'Internação',
      'hotel': 'Hotel',
      'catalog': 'Catálogo',
      'inventory': 'Estoque',
      'purchasing': 'Compras',
      'finance': 'Financeiro',
      'cash': 'Caixa',
      'receivables': 'Recebíveis',
      'payables': 'Pagamentos',
      'reports': 'Relatórios',
      'settings': 'Configurações',
      'org': 'Empresa',
      'users': 'Usuários',
      'permissions': 'Permissões'
    };

    const path = url.map(segment => segment.path).join('/');
    return routeLabels[path] || path;
  }
}
