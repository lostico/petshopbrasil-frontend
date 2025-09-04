import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  showInfo?: boolean;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
}

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="flex items-center justify-center gap-6 py-6 border-t border-secondary-200">
      <!-- Botão Anterior -->
      <app-button
        label="Anterior"
        icon="arrow-left"
        variant="secondary"
        size="sm"
        [disabled]="config.currentPage === 1"
        (clicked)="onPageChange(config.currentPage - 1)">
      </app-button>

      <!-- Informações da Página -->
      @if (config.showInfo !== false) {
        <div class="text-center">
          <div class="text-sm font-medium text-secondary-700">
            Página {{ config.currentPage }} de {{ config.totalPages }}
          </div>
          <div class="text-xs text-secondary-500">
            {{ config.totalItems }} item{{ config.totalItems !== 1 ? 's' : '' }} no total
          </div>
        </div>
      }

      <!-- Números das Páginas -->
      @if (config.showPageNumbers !== false) {
        <div class="flex items-center gap-1">
          @for (page of getVisiblePages(); track page) {
            @if (page === '...') {
              <span class="px-2 py-1 text-sm text-secondary-400">...</span>
            } @else {
              <button
                [class]="getPageButtonClasses(getPageNumber(page))"
                (click)="onPageChange(getPageNumber(page))"
                [disabled]="page === config.currentPage">
                {{ page }}
              </button>
            }
          }
        </div>
      }

      <!-- Botão Próxima -->
      <app-button
        label="Próxima"
        icon="arrow-right"
        variant="secondary"
        size="sm"
        [disabled]="config.currentPage === config.totalPages"
        (clicked)="onPageChange(config.currentPage + 1)">
      </app-button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    button {
      min-width: 2rem;
      height: 2rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      border: 1px solid transparent;
      background-color: transparent;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    button:hover:not(:disabled) {
      background-color: #f1f5f9;
      color: #475569;
    }

    button.active {
      background-color: #2563eb;
      color: white;
      border-color: #2563eb;
    }

    button.active:hover {
      background-color: #1d4ed8;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    button:disabled:hover {
      background-color: transparent;
      color: #64748b;
    }

    /* Responsividade */
    @media (max-width: 640px) {
      .flex {
        flex-direction: column;
        gap: 1rem;
      }
      
      .text-center {
        order: -1;
      }
    }
  `]
})
export class PaginationComponent {
  @Input() config: PaginationConfig = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    showInfo: true,
    showPageNumbers: true,
    maxVisiblePages: 5
  };

  @Output() pageChange = new EventEmitter<number>();

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.config.totalPages && page !== this.config.currentPage) {
      this.pageChange.emit(page);
    }
  }

  getPageNumber(page: number | string): number {
    return typeof page === 'number' ? page : 0;
  }

  getVisiblePages(): (number | string)[] {
    const { currentPage, totalPages, maxVisiblePages = 5 } = this.config;
    
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Ajustar se estivermos muito próximos do final
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Sempre mostrar primeira página
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    // Páginas do meio
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Sempre mostrar última página
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  }

  getPageButtonClasses(page: number): string {
    const baseClasses = 'min-w-8 h-8 px-2 py-1 text-sm font-medium rounded-md border transition-all';
    
    if (page === this.config.currentPage) {
      return `${baseClasses} bg-primary-600 text-white border-primary-600 hover:bg-primary-700`;
    }
    
    return `${baseClasses} bg-transparent text-secondary-600 border-transparent hover:bg-secondary-100 hover:text-secondary-700`;
  }
}
