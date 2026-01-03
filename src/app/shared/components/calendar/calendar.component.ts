import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CalendarDate {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 w-full max-w-sm">
      <!-- Header com navegação -->
      <div class="flex items-center justify-between mb-4">
        <button
          (click)="previousMonth()"
          class="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Mês anterior"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 class="text-lg font-semibold text-gray-900">
          {{ getMonthYearLabel() }}
        </h2>
        
        <button
          (click)="nextMonth()"
          class="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Próximo mês"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Dias da semana -->
      <div class="grid grid-cols-7 gap-1 mb-2">
        @for (day of weekDays; track $index) {
          <div class="text-center text-xs font-medium text-gray-500 py-2">
            {{ day }}
          </div>
        }
      </div>

      <!-- Grid de datas -->
      <div class="grid grid-cols-7 gap-1">
        @for (calendarDate of calendarDates; track calendarDate.date.getTime()) {
          <button
            (click)="selectDate(calendarDate.date)"
            [class]="getDateClasses(calendarDate)"
            [disabled]="!calendarDate.isCurrentMonth && !allowOtherMonths"
            class="aspect-square flex items-center justify-center text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
          >
            {{ calendarDate.date.getDate() }}
          </button>
        }
      </div>
    </div>
  `,
  styles: []
})
export class CalendarComponent implements OnInit {
  @Input() selectedDate: Date | null = null;
  @Input() currentDate: Date = new Date();
  @Input() allowOtherMonths = false;
  @Input() locale = 'pt-BR';

  @Output() dateSelected = new EventEmitter<Date>();
  @Output() monthChanged = new EventEmitter<Date>();

  calendarDates: CalendarDate[] = [];
  weekDays: string[] = [];

  private monthNames: string[] = [];
  private displayDate: Date = new Date();

  ngOnInit(): void {
    this.initializeLocale();
    this.displayDate = this.currentDate ? new Date(this.currentDate) : new Date();
    if (this.selectedDate) {
      this.displayDate = new Date(this.selectedDate);
    }
    this.generateCalendar();
  }

  private initializeLocale(): void {
    // Obter nomes dos dias da semana começando do domingo (0)
    const days = [];
    for (let i = 0; i < 7; i++) {
      // Criar uma data de domingo e adicionar i dias
      const sunday = new Date(2024, 0, 7); // 7 de janeiro de 2024 é um domingo
      const dayDate = new Date(sunday);
      dayDate.setDate(sunday.getDate() + i);
      const dayName = dayDate.toLocaleDateString(this.locale, { weekday: 'short' });
      days.push(dayName.substring(0, 2).toUpperCase());
    }
    this.weekDays = days;

    // Obter nomes dos meses
    for (let i = 0; i < 12; i++) {
      const monthName = new Date(2024, i, 1)
        .toLocaleDateString(this.locale, { month: 'long' });
      // Capitalizar primeira letra
      this.monthNames.push(monthName.charAt(0).toUpperCase() + monthName.slice(1));
    }
  }

  getMonthYearLabel(): string {
    const month = this.monthNames[this.displayDate.getMonth()];
    const year = this.displayDate.getFullYear();
    return `${month} ${year}`;
  }

  generateCalendar(): void {
    const year = this.displayDate.getFullYear();
    const month = this.displayDate.getMonth();
    
    // Primeiro dia do mês
    const firstDay = new Date(year, month, 1);
    // Último dia do mês
    const lastDay = new Date(year, month + 1, 0);
    
    // Primeiro dia da semana do mês (0 = domingo, 1 = segunda, etc.)
    const startDay = firstDay.getDay();
    
    // Data de hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Data selecionada
    const selected = this.selectedDate ? new Date(this.selectedDate) : null;
    if (selected) {
      selected.setHours(0, 0, 0, 0);
    }

    this.calendarDates = [];

    // Adicionar dias do mês anterior (se necessário)
    const daysBefore = startDay;
    if (daysBefore > 0) {
      const prevMonth = new Date(year, month - 1, 0);
      const prevMonthDays = prevMonth.getDate();
      
      for (let i = daysBefore - 1; i >= 0; i--) {
        const date = new Date(year, month - 1, prevMonthDays - i);
        const dateCopy = new Date(date);
        dateCopy.setHours(0, 0, 0, 0);
        
        this.calendarDates.push({
          date,
          isCurrentMonth: false,
          isToday: dateCopy.getTime() === today.getTime(),
          isSelected: selected ? dateCopy.getTime() === selected.getTime() : false
        });
      }
    }

    // Adicionar dias do mês atual
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateCopy = new Date(date);
      dateCopy.setHours(0, 0, 0, 0);
      
      this.calendarDates.push({
        date,
        isCurrentMonth: true,
        isToday: dateCopy.getTime() === today.getTime(),
        isSelected: selected ? dateCopy.getTime() === selected.getTime() : false
      });
    }

    // Adicionar dias do próximo mês (para completar a grade)
    const totalCells = 42; // 6 semanas * 7 dias
    const remainingCells = totalCells - this.calendarDates.length;
    
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(year, month + 1, day);
      const dateCopy = new Date(date);
      dateCopy.setHours(0, 0, 0, 0);
      
      this.calendarDates.push({
        date,
        isCurrentMonth: false,
        isToday: dateCopy.getTime() === today.getTime(),
        isSelected: selected ? dateCopy.getTime() === selected.getTime() : false
      });
    }
  }

  getDateClasses(calendarDate: CalendarDate): string {
    const classes: string[] = [];

    if (calendarDate.isSelected) {
      // Dia selecionado: fundo preto, texto branco
      classes.push('bg-gray-900 text-white font-semibold');
    } else {
      // Cores normais baseadas no mês
      if (!calendarDate.isCurrentMonth) {
        classes.push('text-gray-300');
      } else {
        classes.push('text-gray-700');
      }

      // Estilo para hoje (se não estiver selecionado)
      if (calendarDate.isToday) {
        classes.push('bg-gray-100 text-gray-900 font-semibold');
      } else if (calendarDate.isCurrentMonth) {
        classes.push('hover:bg-gray-100');
      }
    }

    if (!calendarDate.isCurrentMonth && !this.allowOtherMonths) {
      classes.push('cursor-not-allowed opacity-50');
    }

    return classes.join(' ');
  }

  selectDate(date: Date): void {
    if (!this.allowOtherMonths) {
      const year = this.displayDate.getFullYear();
      const month = this.displayDate.getMonth();
      const dateYear = date.getFullYear();
      const dateMonth = date.getMonth();
      
      if (dateYear !== year || dateMonth !== month) {
        return;
      }
    }

    this.selectedDate = new Date(date);
    this.dateSelected.emit(new Date(date));
    this.generateCalendar();
  }

  previousMonth(): void {
    this.displayDate = new Date(this.displayDate.getFullYear(), this.displayDate.getMonth() - 1, 1);
    this.generateCalendar();
    this.monthChanged.emit(new Date(this.displayDate));
  }

  nextMonth(): void {
    this.displayDate = new Date(this.displayDate.getFullYear(), this.displayDate.getMonth() + 1, 1);
    this.generateCalendar();
    this.monthChanged.emit(new Date(this.displayDate));
  }

  goToToday(): void {
    this.displayDate = new Date();
    this.generateCalendar();
    this.monthChanged.emit(new Date(this.displayDate));
  }

  goToDate(date: Date): void {
    this.displayDate = new Date(date);
    this.generateCalendar();
    this.monthChanged.emit(new Date(this.displayDate));
  }
}

