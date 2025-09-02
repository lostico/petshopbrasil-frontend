import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

export interface PaginationConfig {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  maxVisiblePages?: number;
}

export interface PaginationChange {
  page: number;
  itemsPerPage: number;
}

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-lg">
      <!-- Informações da paginação -->
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-700">
          Mostrando {{ startItem }} a {{ endItem }} de {{ config.totalItems }} resultados
        </span>
        
        <!-- Seletor de itens por página -->
        <div class="flex items-center gap-2">
          <label for="itemsPerPage" class="text-sm text-gray-700">Itens por página:</label>
          <select
            id="itemsPerPage"
            [value]="config.itemsPerPage"
            (change)="onItemsPerPageChange($event)"
            class="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      <!-- Controles de navegação -->
      <div class="flex items-center gap-2">
        <!-- Botão primeira página -->
        <button
          (click)="goToPage(1)"
          [disabled]="config.currentPage === 1"
          class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Primeira página"
        >
          <lucide-icon name="chevrons-left" class="w-4 h-4"></lucide-icon>
        </button>

        <!-- Botão página anterior -->
        <button
          (click)="goToPage(config.currentPage - 1)"
          [disabled]="config.currentPage === 1"
          class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Página anterior"
        >
          <lucide-icon name="chevron-left" class="w-4 h-4"></lucide-icon>
        </button>

        <!-- Números das páginas -->
        <div class="flex items-center gap-1">
          <ng-container *ngFor="let page of visiblePages; trackBy: trackByPage">
            <!-- Elipses -->
            <span 
              *ngIf="page === '...'" 
              class="px-3 py-2 text-gray-500"
            >
              ...
            </span>
            
            <!-- Número da página -->
            <button
              *ngIf="page !== '...'"
              (click)="goToPage(+page)"
              [class]="page === config.currentPage 
                ? 'px-3 py-2 text-white bg-blue-600 rounded-md font-medium' 
                : 'px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors'"
            >
              {{ page }}
            </button>
          </ng-container>
        </div>

        <!-- Botão próxima página -->
        <button
          (click)="goToPage(config.currentPage + 1)"
          [disabled]="config.currentPage === totalPages"
          class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Próxima página"
        >
          <lucide-icon name="chevron-right" class="w-4 h-4"></lucide-icon>
        </button>

        <!-- Botão última página -->
        <button
          (click)="goToPage(totalPages)"
          [disabled]="config.currentPage === totalPages"
          class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Última página"
        >
          <lucide-icon name="chevrons-right" class="w-4 h-4"></lucide-icon>
        </button>
      </div>

      <!-- Navegação direta para página -->
      <div class="flex items-center gap-2">
        <label for="goToPage" class="text-sm text-gray-700">Ir para:</label>
        <input
          id="goToPage"
          type="number"
          [min]="1"
          [max]="totalPages"
          [value]="goToPageValue"
          (input)="onGoToPageInput($event)"
          (keyup.enter)="goToPage(goToPageValue)"
          class="w-16 px-2 py-1 text-sm text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Página"
        />
        <span class="text-sm text-gray-500">de {{ totalPages }}</span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() config!: PaginationConfig;
  @Output() pageChange = new EventEmitter<PaginationChange>();

  totalPages = 0;
  startItem = 0;
  endItem = 0;
  visiblePages: (number | string)[] = [];
  goToPageValue = 1;
  maxVisiblePages = 5;

  ngOnInit() {
    this.updatePagination();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.updatePagination();
    }
  }

  updatePagination() {
    if (!this.config) return;

    this.totalPages = Math.ceil(this.config.totalItems / this.config.itemsPerPage);
    this.startItem = (this.config.currentPage - 1) * this.config.itemsPerPage + 1;
    this.endItem = Math.min(this.config.currentPage * this.config.itemsPerPage, this.config.totalItems);
    this.goToPageValue = this.config.currentPage;
    this.maxVisiblePages = this.config.maxVisiblePages || 5;
    
    this.generateVisiblePages();
  }

  generateVisiblePages() {
    this.visiblePages = [];
    
    if (this.totalPages <= this.maxVisiblePages) {
      // Se temos poucas páginas, mostrar todas
      for (let i = 1; i <= this.totalPages; i++) {
        this.visiblePages.push(i);
      }
      return;
    }

    const currentPage = this.config.currentPage;
    const totalPages = this.totalPages;
    const maxVisible = this.maxVisiblePages;

    if (currentPage <= 3) {
      // Páginas iniciais: 1, 2, 3, 4, 5, ...
      for (let i = 1; i <= maxVisible - 1; i++) {
        this.visiblePages.push(i);
      }
      this.visiblePages.push('...');
    } else if (currentPage >= totalPages - 2) {
      // Páginas finais: ..., 6, 7, 8, 9, 10
      this.visiblePages.push('...');
      for (let i = totalPages - maxVisible + 2; i <= totalPages; i++) {
        this.visiblePages.push(i);
      }
    } else {
      // Páginas intermediárias: ..., 4, 5, 6, 7, 8, ...
      this.visiblePages.push('...');
      for (let i = currentPage - Math.floor(maxVisible / 2); i <= currentPage + Math.floor(maxVisible / 2); i++) {
        this.visiblePages.push(i);
      }
      this.visiblePages.push('...');
    }
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.config.currentPage) {
      return;
    }

    this.pageChange.emit({
      page,
      itemsPerPage: this.config.itemsPerPage
    });
  }

  onItemsPerPageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newItemsPerPage = parseInt(target.value);
    
    if (newItemsPerPage !== this.config.itemsPerPage) {
      // Calcular nova página para manter o item atual visível
      const currentFirstItem = (this.config.currentPage - 1) * this.config.itemsPerPage + 1;
      const newPage = Math.ceil(currentFirstItem / newItemsPerPage);
      
      this.pageChange.emit({
        page: newPage,
        itemsPerPage: newItemsPerPage
      });
    }
  }

  onGoToPageInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value);
    
    if (!isNaN(value) && value >= 1 && value <= this.totalPages) {
      this.goToPageValue = value;
    }
  }

  trackByPage(index: number, page: number | string): number | string {
    return page;
  }
}
