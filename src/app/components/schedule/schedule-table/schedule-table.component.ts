import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// Design System Components
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { CardComponent } from '../../../shared/components/card/card.component';

export interface ScheduleAppointment {
  id: string;
  time: string;
  tutorName: string;
  petName: string;
  service: string;
  status: 'confirmed' | 'pending' | 'in-progress' | 'completed' | 'no-show' | 'cancelled';
  category: 'grooming' | 'veterinary';
  professional?: string;
  plan?: string;
  duration?: number; // Duração do serviço em minutos
}

export interface ActionClickEvent {
  action: string;
  appointment: ScheduleAppointment;
}

@Component({
  selector: 'app-schedule-table',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    BadgeComponent,
    CardComponent
  ],
  templateUrl: './schedule-table.component.html',
  styleUrls: ['./schedule-table.component.css']
})
export class ScheduleTableComponent {
  @Input() appointments: ScheduleAppointment[] = [];
  @Input() category: 'grooming' | 'veterinary' = 'grooming';
  @Input() getStatusLabel: (status: string) => string = () => '';
  @Input() getStatusVariant: (status: string) => 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' = () => 'secondary';

  @Output() actionClick = new EventEmitter<ActionClickEvent>();

  onActionClick(action: string, appointment: ScheduleAppointment): void {
    this.actionClick.emit({ action, appointment });
  }

  getTableHeaders(): string[] {
    if (this.category === 'grooming') {
      return ['Hora', 'Tutor/Pet', 'Serviço', 'Status', 'Ações'];
    } else {
      return ['Hora', 'Tutor/Pet', 'Serviço', 'Plano/Convênio', 'Status', 'Ações'];
    }
  }

  getEmptyStateMessage(): string {
    if (this.category === 'grooming') {
      return 'Nenhum agendamento de banho e tosa encontrado para o período selecionado.';
    } else {
      return 'Nenhum agendamento veterinário encontrado para o período selecionado.';
    }
  }
}
