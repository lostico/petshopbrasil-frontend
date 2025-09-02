# Componente de Paginação

O componente `app-pagination` é um componente genérico e reutilizável para implementar paginação em listagens de dados.

## Características

- **Navegação completa**: Primeira página, página anterior, próxima página, última página
- **Seletor de itens por página**: 10, 25, 50, 100 itens
- **Números de página inteligentes**: Mostra elipses (...) quando há muitas páginas
- **Navegação direta**: Campo para ir diretamente para uma página específica
- **Responsivo**: Layout adaptável para diferentes tamanhos de tela
- **Acessível**: Labels e títulos para todos os controles

## Como usar

### 1. Importar o componente

```typescript
import { PaginationComponent, PaginationConfig, PaginationChange } from '../../../shared/components/pagination/pagination.component';

@Component({
  // ...
  imports: [
    // ... outros imports
    PaginationComponent
  ]
})
```

### 2. Configurar a paginação

```typescript
export class SeuComponente {
  // Propriedades de paginação
  currentPage = 1;
  totalItems = 0;
  itemsPerPage = 10;
  
  // Getter para configurar a paginação
  get paginationConfig(): PaginationConfig {
    return {
      currentPage: this.currentPage,
      totalItems: this.totalItems,
      itemsPerPage: this.itemsPerPage,
      maxVisiblePages: 5 // opcional, padrão é 5
    };
  }
}
```

### 3. Implementar o template

```html
<app-pagination
  [config]="paginationConfig"
  (pageChange)="onPageChange($event)">
</app-pagination>
```

### 4. Implementar o handler de mudança

```typescript
onPageChange(change: PaginationChange): void {
  this.currentPage = change.page;
  this.itemsPerPage = change.itemsPerPage;
  this.loadData(); // Sua função para carregar dados
}
```

## Interface PaginationConfig

```typescript
interface PaginationConfig {
  currentPage: number;      // Página atual
  totalItems: number;       // Total de itens
  itemsPerPage: number;     // Itens por página
  maxVisiblePages?: number; // Máximo de páginas visíveis (opcional)
}
```

## Interface PaginationChange

```typescript
interface PaginationChange {
  page: number;         // Nova página
  itemsPerPage: number; // Novos itens por página
}
```

## Comportamento das Páginas Visíveis

O componente automaticamente calcula quais páginas mostrar baseado na página atual:

- **Páginas iniciais** (1, 2, 3): `1 | 2 | 3 | 4 | 5 | ...`
- **Páginas intermediárias** (ex: página 5): `... | 3 | 4 | 5 | 6 | 7 | ...`
- **Páginas finais** (ex: página 8 de 10): `... | 6 | 7 | 8 | 9 | 10`

## Estilização

O componente usa Tailwind CSS e segue o design system do projeto. As classes podem ser customizadas através do atributo `class`:

```html
<app-pagination
  [config]="paginationConfig"
  (pageChange)="onPageChange($event)"
  class="mt-6 bg-gray-50">
</app-pagination>
```

## Exemplo Completo

```typescript
// Componente
export class ListaComponent {
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
  
  onPageChange(change: PaginationChange): void {
    this.currentPage = change.page;
    this.itemsPerPage = change.itemsPerPage;
    this.loadItems();
  }
  
  private loadItems(): void {
    // Sua lógica para carregar dados paginados
    this.service.getItems(this.currentPage, this.itemsPerPage)
      .subscribe(response => {
        this.items = response.data;
        this.totalItems = response.total;
      });
  }
}
```

```html
<!-- Template -->
<div class="space-y-4">
  <!-- Sua lista de itens -->
  <div *ngFor="let item of items">
    {{ item.name }}
  </div>
  
  <!-- Paginação -->
  <app-pagination
    [config]="paginationConfig"
    (pageChange)="onPageChange($event)">
  </app-pagination>
</div>
```

## Dependências

- Angular Common
- Lucide Angular (para ícones)
- Tailwind CSS (para estilos)
