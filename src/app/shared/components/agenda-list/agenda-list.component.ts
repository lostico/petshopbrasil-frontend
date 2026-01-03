import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../badge/badge.component';

export interface Agenda {
  id: string;
  name: string;
  category: 'veterinary' | 'grooming' | 'hotel';
  color: string; // Cor do círculo indicador (hex)
  description?: string;
  startHour?: number; // Hora de início (0-23)
  endHour?: number; // Hora de fim (0-23)
  // Configurações de altura da timeline
  hourHeight?: number; // Altura fixa de 1 hora em pixels (opcional, calculado dinamicamente se não fornecido)
  minHourHeight?: number; // Altura mínima de 1 hora em pixels
  maxHourHeight?: number; // Altura máxima de 1 hora em pixels
  intervalMinutes?: number; // Intervalo entre linhas de grade em minutos (15, 30, 60, etc.)
  minIntervalHeight?: number; // Altura mínima de cada intervalo em pixels
}

interface GroupedAgendas {
  category: 'veterinary' | 'grooming' | 'hotel';
  label: string;
  agendas: Agenda[];
}

@Component({
  selector: 'app-agenda-list',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <div class="bg-white rounded-lg shadow-sm border border-secondary-200">
      <!-- Cabeçalho -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
        <h2 class="text-xl font-semibold text-secondary-900">Agendas</h2>
        <div class="flex items-center gap-3">
          @if (selectedCount > 0) {
            <app-badge
              variant="secondary"
              size="sm"
              [text]="selectedCount + (selectedCount === 1 ? ' selecionada' : ' selecionadas')"
              [rounded]="true">
            </app-badge>
          }
          <button
            (click)="onCreateClick()"
            type="button"
            class="flex items-center justify-center w-8 h-8 rounded-md bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            aria-label="Criar nova agenda"
            title="Criar nova agenda">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Lista de Agendas -->
      <div class="p-6 space-y-6">
        @for (group of groupedAgendas; track group.category) {
          <div class="space-y-3">
            <!-- Título da Categoria -->
            <h3 class="text-xs font-semibold text-secondary-500 uppercase tracking-wider">
              {{ group.label }}
            </h3>

            <!-- Itens da Categoria -->
            <div class="space-y-2">
              @for (agenda of group.agendas; track agenda.id) {
                <label
                  class="flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors hover:bg-secondary-50"
                  [class.bg-primary-50]="isSelected(agenda.id)">
                  <!-- Checkbox Customizado -->
                  <div class="relative flex items-center">
                    <input
                      type="checkbox"
                      [checked]="isSelected(agenda.id)"
                      (change)="toggleSelection(agenda.id)"
                      class="sr-only"
                      [id]="'agenda-' + agenda.id">
                    <div
                      class="w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center"
                      [class.bg-primary-600]="isSelected(agenda.id)"
                      [class.border-primary-600]="isSelected(agenda.id)"
                      [class.border-secondary-300]="!isSelected(agenda.id)"
                      [class.hover:border-primary-500]="!isSelected(agenda.id)">
                      @if (isSelected(agenda.id)) {
                        <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                      }
                    </div>
                  </div>

                  <!-- Círculo Colorido -->
                  <div
                    class="w-3 h-3 rounded-full flex-shrink-0"
                    [style.background-color]="agenda.color">
                  </div>

                  <!-- Nome da Agenda -->
                  <span class="flex-1 text-sm font-medium text-secondary-900">
                    {{ agenda.name }}
                  </span>
                </label>
              }
            </div>
          </div>
        }

        <!-- Estado Vazio -->
        @if (groupedAgendas.length === 0) {
          <div class="text-center py-8">
            <p class="text-sm text-secondary-500">Nenhuma agenda disponível</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: []
})
export class AgendaListComponent implements OnInit, OnChanges {
  @Input() agendas: Agenda[] = [];
  @Input() selectedAgendas: string[] = [];

  @Output() selectionChange = new EventEmitter<string[]>();
  @Output() createClick = new EventEmitter<void>();

  private internalSelected: string[] = [];
  groupedAgendas: GroupedAgendas[] = [];

  ngOnInit(): void {
    this.initializeSelection();
    this.groupAgendas();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['agendas']) {
      this.groupAgendas();
    }
    if (changes['selectedAgendas']) {
      this.initializeSelection();
    }
  }

  get selectedCount(): number {
    return this.internalSelected.length;
  }

  private initializeSelection(): void {
    if (this.selectedAgendas && this.selectedAgendas.length > 0) {
      this.internalSelected = [...this.selectedAgendas];
    } else {
      this.internalSelected = [];
    }
  }

  groupAgendas(): void {
    const categoryMap = new Map<string, Agenda[]>();

    // Agrupar agendas por categoria
    this.agendas.forEach(agenda => {
      if (!categoryMap.has(agenda.category)) {
        categoryMap.set(agenda.category, []);
      }
      categoryMap.get(agenda.category)!.push(agenda);
    });

    // Converter para array e mapear labels
    this.groupedAgendas = Array.from(categoryMap.entries()).map(([category, agendas]) => ({
      category: category as 'veterinary' | 'grooming' | 'hotel',
      label: this.getCategoryLabel(category as 'veterinary' | 'grooming' | 'hotel'),
      agendas: agendas.sort((a, b) => a.name.localeCompare(b.name))
    }));

    // Ordenar grupos: veterinary, grooming, hotel
    const categoryOrder: ('veterinary' | 'grooming' | 'hotel')[] = ['veterinary', 'grooming', 'hotel'];
    this.groupedAgendas.sort((a, b) => {
      return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
    });
  }

  private getCategoryLabel(category: 'veterinary' | 'grooming' | 'hotel'): string {
    const labels = {
      veterinary: 'VETERINÁRIA',
      grooming: 'BANHO E TOSA',
      hotel: 'HOTEL'
    };
    return labels[category];
  }

  isSelected(agendaId: string): boolean {
    return this.internalSelected.includes(agendaId);
  }

  toggleSelection(agendaId: string): void {
    const index = this.internalSelected.indexOf(agendaId);
    
    if (index > -1) {
      // Remover da seleção
      this.internalSelected.splice(index, 1);
    } else {
      // Adicionar à seleção
      this.internalSelected.push(agendaId);
    }

    // Emitir evento com nova lista de selecionados
    this.selectionChange.emit([...this.internalSelected]);
  }

  onCreateClick(): void {
    this.createClick.emit();
  }
}