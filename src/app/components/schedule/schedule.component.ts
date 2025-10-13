import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Design System Components
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { PageContainerComponent } from '../../shared/components/page-container/page-container.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

// Schedule Components
import { ScheduleFiltersComponent } from './schedule-filters/schedule-filters.component';
import { ScheduleTableComponent } from './schedule-table/schedule-table.component';

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
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    CardComponent,
    BadgeComponent,
    PageContainerComponent,
    PageHeaderComponent,
    ScheduleFiltersComponent,
    ScheduleTableComponent
  ],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  // View state
  currentView: 'table' | 'list' | 'calendar' = 'table';
  
  // Filter states
  filters = {
    period: 'today',
    category: 'all',
    professional: 'all',
    status: 'all'
  };

  // Mock data
  groomingAppointments: ScheduleAppointment[] = [
    {
      id: '1',
      time: '08:00',
      tutorName: 'Maria Silva',
      petName: 'Rex',
      service: 'Banho e Tosa Completa',
      status: 'confirmed',
      category: 'grooming',
      professional: 'Turno Manhã'
    },
    {
      id: '2',
      time: '09:30',
      tutorName: 'João Santos',
      petName: 'Luna',
      service: 'Banho Simples',
      status: 'in-progress',
      category: 'grooming',
      professional: 'Turno Manhã'
    },
    {
      id: '3',
      time: '14:00',
      tutorName: 'Ana Costa',
      petName: 'Max',
      service: 'Tosa Higiênica',
      status: 'pending',
      category: 'grooming',
      professional: 'Turno Tarde'
    },
    {
      id: '4',
      time: '16:30',
      tutorName: 'Carlos Oliveira',
      petName: 'Bella',
      service: 'Banho e Tosa Completa',
      status: 'confirmed',
      category: 'grooming',
      professional: 'Turno Tarde'
    }
  ];

  veterinaryAppointments: ScheduleAppointment[] = [
    {
      id: '5',
      time: '08:30',
      tutorName: 'Pedro Lima',
      petName: 'Thor',
      service: 'Consulta Clínica',
      status: 'completed',
      category: 'veterinary',
      professional: 'Dr. Carlos Mendes',
      plan: 'PetLove'
    },
    {
      id: '6',
      time: '10:00',
      tutorName: 'Fernanda Rocha',
      petName: 'Mimi',
      service: 'Vacinação',
      status: 'confirmed',
      category: 'veterinary',
      professional: 'Dra. Ana Paula',
      plan: 'Particular'
    },
    {
      id: '7',
      time: '11:30',
      tutorName: 'Roberto Alves',
      petName: 'Zeus',
      service: 'Exame de Sangue',
      status: 'in-progress',
      category: 'veterinary',
      professional: 'Dr. Carlos Mendes',
      plan: 'Petz'
    },
    {
      id: '8',
      time: '15:00',
      tutorName: 'Lucia Ferreira',
      petName: 'Nina',
      service: 'Consulta Dermatológica',
      status: 'pending',
      category: 'veterinary',
      professional: 'Dra. Ana Paula',
      plan: 'Particular'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Initialize component
  }

  onFiltersChange(filters: any): void {
    this.filters = { ...filters };
    // Apply filters logic here
  }

  onViewChange(view: 'table' | 'list' | 'calendar'): void {
    this.currentView = view;
  }

  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'confirmed': 'Confirmado',
      'pending': 'Pendente',
      'in-progress': 'Em Atendimento',
      'completed': 'Finalizado',
      'no-show': 'Não Compareceu',
      'cancelled': 'Cancelado'
    };
    return statusLabels[status] || status;
  }

  getStatusVariant(status: string): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' {
    const statusVariants: { [key: string]: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' } = {
      'confirmed': 'success',
      'pending': 'warning',
      'in-progress': 'info',
      'completed': 'success',
      'no-show': 'danger',
      'cancelled': 'secondary'
    };
    return statusVariants[status] || 'secondary';
  }

  onAppointmentAction(action: string, appointment: ScheduleAppointment | null): void {
    console.log('Action:', action, 'Appointment:', appointment);
    // Implement action logic here
  }
}
