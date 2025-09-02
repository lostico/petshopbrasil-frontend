# Exemplos de Implementação do Componente de Paginação

Este arquivo contém exemplos práticos de como implementar o componente de paginação em diferentes cenários.

## Exemplo 1: Lista Simples de Itens

### Componente TypeScript
```typescript
import { Component, OnInit } from '@angular/core';
import { PaginationComponent, PaginationConfig, PaginationChange } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-lista-simples',
  standalone: true,
  imports: [PaginationComponent],
  template: `
    <div class="space-y-4">
      <!-- Lista de itens -->
      <div *ngFor="let item of items" class="p-4 border rounded">
        {{ item.name }}
      </div>
      
      <!-- Paginação -->
      <app-pagination
        [config]="paginationConfig"
        (pageChange)="onPageChange($event)">
      </app-pagination>
    </div>
  `
})
export class ListaSimplesComponent implements OnInit {
  items: any[] = [];
  currentPage = 1;
  totalItems = 0;
  itemsPerPage = 10;
  
  get paginationConfig(): PaginationConfig {
    return {
      currentPage: this.currentPage,
      totalItems: this.totalItems,
      itemsPerPage: this.itemsPerPage
    };
  }
  
  ngOnInit() {
    this.loadItems();
  }
  
  onPageChange(change: PaginationChange): void {
    this.currentPage = change.page;
    this.itemsPerPage = change.itemsPerPage;
    this.loadItems();
  }
  
  private loadItems(): void {
    // Simular carregamento de dados
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    // Aqui você faria uma chamada para sua API
    // this.service.getItems(this.currentPage, this.itemsPerPage)
    
    // Exemplo com dados mockados
    this.items = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`
    })).slice(startIndex, endIndex);
    
    this.totalItems = 100;
  }
}
```

## Exemplo 2: Lista com Filtros e Busca

### Componente TypeScript
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { PaginationComponent, PaginationConfig, PaginationChange } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-lista-com-filtros',
  standalone: true,
  imports: [PaginationComponent],
  template: `
    <div class="space-y-6">
      <!-- Filtros -->
      <div class="flex gap-4">
        <input 
          type="text" 
          placeholder="Buscar..." 
          (input)="onSearchChange($event)"
          class="px-3 py-2 border rounded">
        
        <select (change)="onFilterChange($event)" class="px-3 py-2 border rounded">
          <option value="">Todos</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
      </div>
      
      <!-- Lista -->
      <div *ngFor="let item of items" class="p-4 border rounded">
        {{ item.name }} - {{ item.status }}
      </div>
      
      <!-- Paginação -->
      <app-pagination
        [config]="paginationConfig"
        (pageChange)="onPageChange($event)">
      </app-pagination>
    </div>
  `
})
export class ListaComFiltrosComponent implements OnInit, OnDestroy {
  items: any[] = [];
  currentPage = 1;
  totalItems = 0;
  itemsPerPage = 25; // Começar com 25 itens por página
  
  searchTerm = '';
  selectedFilter = '';
  
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  
  get paginationConfig(): PaginationConfig {
    return {
      currentPage: this.currentPage,
      totalItems: this.totalItems,
      itemsPerPage: this.itemsPerPage,
      maxVisiblePages: 7 // Mostrar mais páginas
    };
  }
  
  ngOnInit() {
    this.setupSearch();
    this.loadItems();
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private setupSearch(): void {
    this.searchSubject
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.currentPage = 1; // Reset para primeira página
        this.loadItems();
      });
  }
  
  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.searchSubject.next(this.searchTerm);
  }
  
  onFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedFilter = target.value;
    this.currentPage = 1; // Reset para primeira página
    this.loadItems();
  }
  
  onPageChange(change: PaginationChange): void {
    this.currentPage = change.page;
    this.itemsPerPage = change.itemsPerPage;
    this.loadItems();
  }
  
  private loadItems(): void {
    // Aqui você faria uma chamada para sua API com filtros
    // this.service.getItems({
    //   page: this.currentPage,
    //   limit: this.itemsPerPage,
    //   search: this.searchTerm,
    //   filter: this.selectedFilter
    // })
    
    // Exemplo com dados mockados
    const filteredItems = Array.from({ length: 250 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      status: i % 2 === 0 ? 'ativo' : 'inativo'
    })).filter(item => {
      if (this.searchTerm && !item.name.toLowerCase().includes(this.searchTerm.toLowerCase())) {
        return false;
      }
      if (this.selectedFilter && item.status !== this.selectedFilter) {
        return false;
      }
      return true;
    });
    
    this.totalItems = filteredItems.length;
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.items = filteredItems.slice(startIndex, endIndex);
  }
}
```

## Exemplo 3: Lista com Dados da API

### Componente TypeScript
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PaginationComponent, PaginationConfig, PaginationChange } from '../../../shared/components/pagination/pagination.component';

interface ApiResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
}

@Component({
  selector: 'app-lista-api',
  standalone: true,
  imports: [PaginationComponent],
  template: `
    <div class="space-y-4">
      <!-- Loading -->
      <div *ngIf="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2 text-gray-600">Carregando...</p>
      </div>
      
      <!-- Lista -->
      <div *ngIf="!loading && items.length > 0" class="space-y-2">
        <div *ngFor="let item of items" class="p-4 border rounded">
          {{ item.name }}
        </div>
      </div>
      
      <!-- Empty State -->
      <div *ngIf="!loading && items.length === 0" class="text-center py-8 text-gray-500">
        Nenhum item encontrado
      </div>
      
      <!-- Paginação -->
      <app-pagination
        *ngIf="!loading && totalPages > 1"
        [config]="paginationConfig"
        (pageChange)="onPageChange($event)">
      </app-pagination>
    </div>
  `
})
export class ListaApiComponent implements OnInit, OnDestroy {
  items: any[] = [];
  loading = false;
  error = '';
  
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  itemsPerPage = 10;
  
  private destroy$ = new Subject<void>();
  
  get paginationConfig(): PaginationConfig {
    return {
      currentPage: this.currentPage,
      totalItems: this.totalItems,
      itemsPerPage: this.itemsPerPage
    };
  }
  
  ngOnInit() {
    this.loadItems();
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  onPageChange(change: PaginationChange): void {
    this.currentPage = change.page;
    this.itemsPerPage = change.itemsPerPage;
    this.loadItems();
  }
  
  private loadItems(): void {
    this.loading = true;
    this.error = '';
    
    // Exemplo de chamada para API
    // this.service.getItems({
    //   page: this.currentPage,
    //   limit: this.itemsPerPage
    // }).pipe(
    //   takeUntil(this.destroy$)
    // ).subscribe({
    //   next: (response: ApiResponse<any>) => {
    //     this.items = response.data;
    //     this.totalPages = response.pagination.pages;
    //     this.totalItems = response.pagination.total;
    //     this.currentPage = response.pagination.page;
    //     this.itemsPerPage = response.pagination.limit;
    //     this.loading = false;
    //   },
    //   error: (error) => {
    //     this.error = 'Erro ao carregar dados';
    //     this.loading = false;
    //     console.error('Erro:', error);
    //   }
    // });
    
    // Simulação de API
    setTimeout(() => {
      const mockResponse: ApiResponse<any> = {
        data: Array.from({ length: this.itemsPerPage }, (_, i) => ({
          id: (this.currentPage - 1) * this.itemsPerPage + i + 1,
          name: `Item ${(this.currentPage - 1) * this.itemsPerPage + i + 1}`
        })),
        pagination: {
          page: this.currentPage,
          pages: Math.ceil(100 / this.itemsPerPage),
          total: 100,
          limit: this.itemsPerPage
        }
      };
      
      this.items = mockResponse.data;
      this.totalPages = mockResponse.pagination.pages;
      this.totalItems = mockResponse.pagination.total;
      this.currentPage = mockResponse.pagination.page;
      this.itemsPerPage = mockResponse.pagination.limit;
      this.loading = false;
    }, 500);
  }
}
```

## Exemplo 4: Customização de Estilos

### Template HTML
```html
<!-- Paginação com estilos customizados -->
<app-pagination
  [config]="paginationConfig"
  (pageChange)="onPageChange($event)"
  class="mt-8 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
</app-pagination>

<!-- Paginação compacta -->
<app-pagination
  [config]="paginationConfig"
  (pageChange)="onPageChange($event)"
  class="mt-4 p-2 bg-white border border-gray-300 rounded">
</app-pagination>

<!-- Paginação com margens específicas -->
<app-pagination
  [config]="paginationConfig"
  (pageChange)="onPageChange($event)"
  class="mx-auto max-w-4xl mt-8 mb-4">
</app-pagination>
```

## Dicas de Implementação

1. **Sempre resetar para página 1** quando aplicar filtros ou busca
2. **Usar debounce** para campos de busca para evitar muitas chamadas à API
3. **Manter o estado da paginação** sincronizado com a resposta da API
4. **Considerar o tamanho da tela** ao definir `maxVisiblePages`
5. **Implementar loading states** para melhor UX durante mudanças de página
6. **Tratar erros** adequadamente e mostrar mensagens para o usuário

## Padrões Comuns

- **Página inicial**: 10 itens por página
- **Páginas visíveis**: 5-7 páginas para melhor usabilidade
- **Reset de página**: Sempre voltar para página 1 ao aplicar filtros
- **Debounce**: 300-500ms para campos de busca
- **Loading**: Mostrar indicador durante carregamento
