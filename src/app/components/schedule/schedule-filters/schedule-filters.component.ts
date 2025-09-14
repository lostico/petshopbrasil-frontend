import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Design System Components
import { SelectComponent } from '../../../shared/components/select/select.component';

export interface ScheduleFilters {
  period: string;
  category: string;
  professional: string;
  status: string;
}

@Component({
  selector: 'app-schedule-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SelectComponent
  ],
  templateUrl: './schedule-filters.component.html',
  styleUrls: ['./schedule-filters.component.css']
})
export class ScheduleFiltersComponent implements OnInit {
  @Input() filters: ScheduleFilters = {
    period: 'today',
    category: 'all',
    professional: 'all',
    status: 'all'
  };

  @Output() filtersChange = new EventEmitter<ScheduleFilters>();
  @Output() viewChange = new EventEmitter<'table' | 'list' | 'calendar'>();

  // Filter options
  periodOptions = [
    { value: 'today', label: 'Hoje' },
    { value: 'this-week', label: 'Esta Semana' },
    { value: 'next-week', label: 'Próxima Semana' },
    { value: 'custom', label: 'Personalizado...' }
  ];

  categoryOptions = [
    { value: 'all', label: 'Todas' },
    { value: 'grooming', label: 'Banho e Tosa' },
    { value: 'veterinary', label: 'Veterinário' }
  ];

  professionalOptions = [
    { value: 'all', label: 'Todos' },
    { 
      group: 'Veterinário',
      options: [
        { value: 'dr-carlos-mendes', label: 'Dr. Carlos Mendes' },
        { value: 'dra-ana-paula', label: 'Dra. Ana Paula' },
        { value: 'dr-joao-silva', label: 'Dr. João Silva' },
        { value: 'dra-maria-santos', label: 'Dra. Maria Santos' }
      ]
    },
    {
      group: 'Banho e Tosa',
      options: [
        { value: 'turno-manha', label: 'Turno Manhã' },
        { value: 'turno-tarde', label: 'Turno Tarde' },
        { value: 'turno-noite', label: 'Turno Noite' }
      ]
    }
  ];

  statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'confirmed', label: 'Confirmado' },
    { value: 'pending', label: 'Pendente' },
    { value: 'in-progress', label: 'Em Atendimento' },
    { value: 'completed', label: 'Finalizado' },
    { value: 'no-show', label: 'Não Compareceu' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  constructor() { }

  ngOnInit(): void {
    // Initialize component
  }

  onFilterChange(filterType: keyof ScheduleFilters, value: string): void {
    const updatedFilters = { ...this.filters, [filterType]: value };
    this.filtersChange.emit(updatedFilters);
  }

  onViewChange(view: 'table' | 'list' | 'calendar'): void {
    this.viewChange.emit(view);
  }

  getProfessionalOptions(): any[] {
    return this.professionalOptions;
  }
}

