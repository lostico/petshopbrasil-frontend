import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Design System Components
import { CardComponent } from '../../shared/components/card/card.component';
import { PageContainerComponent } from '../../shared/components/page-container/page-container.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { CalendarComponent } from '../../shared/components/calendar/calendar.component';
import { AgendaListComponent, Agenda } from '../../shared/components/agenda-list/agenda-list.component';

// Schedule Components
import { ScheduleTimelineComponent, SlotClickEvent } from './schedule-timeline/schedule-timeline.component';
import { ScheduleFormComponent } from './schedule-form/schedule-form.component';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';

// Services
import { ScheduleService, TimelineResponse, TimelineSlot, Schedule, ScheduleDay } from '../../services/schedule.service';
import { AppointmentService, Appointment } from '../../services/appointment.service';
import { ToastService } from '../../shared/services/toast.service';

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

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    PageContainerComponent,
    PageHeaderComponent,
    CalendarComponent,
    AgendaListComponent,
    ScheduleTimelineComponent,
    ScheduleFormComponent,
    AppointmentFormComponent
  ],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  // Selected date from calendar
  selectedDate: Date = new Date();
  
  // Selected agendas
  selectedAgendas: string[] = [];
  
  // All available agendas
  agendas: Agenda[] = [];

  // All appointments with resource/agenda mapping
  allAppointments: (ScheduleAppointment & { resourceId: string; date: Date })[] = [];
  
  // Timeline configuration
  startHour: number = 8;
  endHour: number = 18;
  hourHeight: number = 60;
  currentTime: Date = new Date();
  today: Date = new Date();

  // Timeline data cache
  timelineData: Map<string, TimelineResponse> = new Map();
  loadingTimelines: Set<string> = new Set();

  // Modal states
  showScheduleForm = false;
  showAppointmentForm = false;
  selectedSchedule: Schedule | null = null;
  selectedAppointment: Appointment | null = null;
  selectedAppointmentDate: string | null = null;
  selectedAppointmentTime: string | null = null;
  selectedScheduleId: string | null = null;

  constructor(
    private scheduleService: ScheduleService,
    private appointmentService: AppointmentService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadAgendas();
  }

  /**
   * Carrega as agendas da API
   */
  loadAgendas(): void {
    this.scheduleService.getSchedules({ isActive: true }).subscribe({
      next: (response) => {
        this.agendas = response.schedules.map(schedule => this.mapScheduleToAgenda(schedule));
        // Select all agendas by default
        this.selectedAgendas = this.agendas.map(a => a.id);
        // Load timeline data for selected date
        this.loadTimelinesForSelectedDate();
      },
      error: (error) => {
        console.error('Erro ao carregar agendas:', error);
        // Em caso de erro, inicializar com array vazio
        this.agendas = [];
        this.selectedAgendas = [];
      }
    });
  }

  /**
   * Mapeia um Schedule da API para o formato Agenda esperado pelo componente
   */
  private mapScheduleToAgenda(schedule: Schedule): Agenda {
    // Mapear categoria da API para o formato esperado
    const categoryMap: Record<string, 'veterinary' | 'grooming' | 'hotel'> = {
      'VETERINARIA': 'veterinary',
      'BANHO_E_TOSA': 'grooming',
      'HOTEL': 'hotel'
    };

    const category = categoryMap[schedule.category] || 'veterinary';

    // Calcular horários de início e fim baseado nos scheduleDays
    let startHour: number | undefined;
    let endHour: number | undefined;

    if (schedule.scheduleDays && schedule.scheduleDays.length > 0) {
      const activeDays = schedule.scheduleDays.filter((day: ScheduleDay) => day.isActive);
      if (activeDays.length > 0) {
        const startTimes = activeDays.map((day: ScheduleDay) => {
          const [hours] = day.startTime.split(':').map(Number);
          return hours;
        });
        const endTimes = activeDays.map((day: ScheduleDay) => {
          const [hours] = day.endTime.split(':').map(Number);
          return hours;
        });
        startHour = Math.min(...startTimes);
        endHour = Math.max(...endTimes);
      }
    }

    return {
      id: schedule.id,
      name: schedule.name,
      category,
      color: schedule.color,
      description: schedule.description || undefined,
      startHour,
      endHour,
      intervalMinutes: schedule.timeInterval,
    };
  }

  /**
   * Carrega as timelines para todas as agendas selecionadas na data atual
   */
  loadTimelinesForSelectedDate(): void {
    const dateStr = this.formatDate(this.selectedDate);
    const selectedAgendas = this.getSelectedAgendasForDisplay();

    // Limpar appointments antigos
    this.allAppointments = [];

    // Buscar timeline para cada agenda selecionada
    const timelineRequests = selectedAgendas.map(agenda => {
      const cacheKey = `${agenda.id}-${dateStr}`;
      
      // Se já está em cache, usar os dados do cache
      if (this.timelineData.has(cacheKey)) {
        const cachedData = this.timelineData.get(cacheKey)!;
        return of(cachedData).pipe(
          map(data => ({ agendaId: agenda.id, data }))
        );
      }

      // Se já está carregando, pular
      if (this.loadingTimelines.has(cacheKey)) {
        return of(null).pipe(
          map(() => ({ agendaId: agenda.id, data: null }))
        );
      }

      // Marcar como carregando
      this.loadingTimelines.add(cacheKey);

      // Buscar da API
      return this.scheduleService.getTimeline(agenda.id, { date: dateStr }).pipe(
        map(data => {
          // Salvar no cache
          this.timelineData.set(cacheKey, data);
          this.loadingTimelines.delete(cacheKey);
          return { agendaId: agenda.id, data };
        }),
        catchError(error => {
          console.error(`Erro ao carregar timeline para agenda ${agenda.id}:`, error);
          this.loadingTimelines.delete(cacheKey);
          return of({ agendaId: agenda.id, data: null });
        })
      );
    });

    // Executar todas as requisições
    forkJoin(timelineRequests).subscribe(results => {
      results.forEach(({ agendaId, data }) => {
        if (data) {
          this.processTimelineData(agendaId, data);
        }
      });
    });
  }

  /**
   * Processa os dados da timeline e converte para o formato de appointments
   */
  processTimelineData(agendaId: string, timelineData: TimelineResponse): void {
    const appointments: (ScheduleAppointment & { resourceId: string; date: Date })[] = [];

    timelineData.slots.forEach(slot => {
      if (!slot.available && slot.appointment) {
        const appointment = slot.appointment;
        const appointmentDate = new Date(appointment.date);
        
        // Converter status da API para o formato do componente
        let status: ScheduleAppointment['status'] = 'pending';
        if (appointment.status === 'CONFIRMED') {
          status = 'confirmed';
        } else if (appointment.status === 'IN_PROGRESS') {
          status = 'in-progress';
        } else if (appointment.status === 'SCHEDULED') {
          status = 'pending';
        }

        // Determinar categoria baseado no serviço
        let category: ScheduleAppointment['category'] = 'veterinary';
        if (appointment.service.category === 'GROOMING') {
          category = 'grooming';
        }

        appointments.push({
          id: appointment.id,
          time: slot.time, // Usar o horário do slot, não do appointment
          tutorName: appointment.clinicTutor.name,
          petName: appointment.pet.name,
          service: appointment.service.name,
          status,
          category,
          professional: appointment.vet?.name || undefined, // Tratar caso vet seja null
          resourceId: agendaId,
          date: appointmentDate,
          duration: appointment.service.duration
        });
      }
    });

    // Adicionar aos appointments existentes (removendo duplicatas da mesma agenda)
    this.allAppointments = this.allAppointments.filter(apt => apt.resourceId !== agendaId);
    this.allAppointments.push(...appointments);
  }

  onDateSelected(date: Date): void {
    this.selectedDate = new Date(date);
    this.loadTimelinesForSelectedDate();
  }

  onAgendasSelectionChange(selectedIds: string[]): void {
    this.selectedAgendas = selectedIds;
    this.loadTimelinesForSelectedDate();
  }

  getFilteredAppointmentsForAgenda(agendaId: string): ScheduleAppointment[] {
    const selectedDateStr = this.formatDate(this.selectedDate);
    
    return this.allAppointments
      .filter(apt => {
        const aptDateStr = this.formatDate(apt.date);
        return apt.resourceId === agendaId && aptDateStr === selectedDateStr;
      })
      .map(apt => {
        // Remove resourceId and date from the appointment object
        const { resourceId, date, ...appointment } = apt;
        return appointment;
      });
  }

  getSelectedAgendasForDisplay(): Agenda[] {
    return this.agendas.filter(agenda => this.selectedAgendas.includes(agenda.id));
  }

  getAgendaStartHour(agenda: Agenda): number {
    // Tentar obter do cache de timeline primeiro
    const dateStr = this.formatDate(this.selectedDate);
    const cacheKey = `${agenda.id}-${dateStr}`;
    const timelineData = this.timelineData.get(cacheKey);
    
    if (timelineData?.workingHours?.start) {
      const [hours] = timelineData.workingHours.start.split(':').map(Number);
      return hours;
    }
    
    return agenda.startHour ?? this.startHour;
  }

  getAgendaEndHour(agenda: Agenda): number {
    // Tentar obter do cache de timeline primeiro
    const dateStr = this.formatDate(this.selectedDate);
    const cacheKey = `${agenda.id}-${dateStr}`;
    const timelineData = this.timelineData.get(cacheKey);
    
    if (timelineData?.workingHours?.end) {
      const [hours] = timelineData.workingHours.end.split(':').map(Number);
      return hours;
    }
    
    return agenda.endHour ?? this.endHour;
  }

  getAgendaHourHeight(agenda: Agenda): number | undefined {
    return agenda.hourHeight;
  }

  getAgendaMinHourHeight(agenda: Agenda): number {
    return agenda.minHourHeight ?? 40;
  }

  getAgendaMaxHourHeight(agenda: Agenda): number {
    return agenda.maxHourHeight ?? 120;
  }

  getAgendaIntervalMinutes(agenda: Agenda): number {
    // Tentar obter do cache de timeline primeiro
    const dateStr = this.formatDate(this.selectedDate);
    const cacheKey = `${agenda.id}-${dateStr}`;
    const timelineData = this.timelineData.get(cacheKey);
    
    if (timelineData?.timeInterval) {
      return timelineData.timeInterval;
    }
    
    return agenda.intervalMinutes ?? 15;
  }

  getAgendaSlots(agenda: Agenda): TimelineSlot[] {
    // Obter slots do cache de timeline
    const dateStr = this.formatDate(this.selectedDate);
    const cacheKey = `${agenda.id}-${dateStr}`;
    const timelineData = this.timelineData.get(cacheKey);
    
    if (timelineData?.slots) {
      return timelineData.slots;
    }
    
    return [];
  }

  getAgendaMinIntervalHeight(agenda: Agenda): number {
    return agenda.minIntervalHeight ?? 15;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSlotClick(event: SlotClickEvent, agendaId: string): void {
    this.selectedScheduleId = agendaId;
    this.selectedAppointmentDate = this.formatDate(this.selectedDate);
    this.selectedAppointmentTime = `${String(event.hour).padStart(2, '0')}:${String(event.minute).padStart(2, '0')}`;
    this.showAppointmentForm = true;
  }

  onAppointmentClick(appointment: ScheduleAppointment): void {
    // Buscar o agendamento completo da API
    this.appointmentService.getAppointmentById(appointment.id)
      .subscribe({
        next: (response) => {
          // Abrir modal de edição
          this.selectedAppointment = response.appointment;
          this.selectedScheduleId = null;
          this.selectedAppointmentDate = null;
          this.selectedAppointmentTime = null;
          this.showAppointmentForm = true;
        },
        error: (error) => {
          this.toastService.showError('Erro ao carregar agendamento.');
          console.error('Erro ao carregar agendamento:', error);
        }
      });
  }

  onAppointmentAction(action: string, appointment: ScheduleAppointment | null): void {
    if (action === 'create') {
      this.selectedAppointment = null;
      this.selectedScheduleId = null;
      this.selectedAppointmentDate = this.formatDate(this.selectedDate);
      this.selectedAppointmentTime = null;
      this.showAppointmentForm = true;
    }
  }

  onScheduleFormClose(): void {
    this.showScheduleForm = false;
    this.selectedSchedule = null;
  }

  onScheduleFormSaved(schedule: Schedule): void {
    // Recarregar agendas
    this.loadAgendas();
    this.onScheduleFormClose();
  }

  onAppointmentFormClose(): void {
    this.showAppointmentForm = false;
    this.selectedAppointment = null;
    this.selectedScheduleId = null;
    this.selectedAppointmentDate = null;
    this.selectedAppointmentTime = null;
  }

  onAppointmentFormSaved(appointment: Appointment): void {
    // Recarregar timelines
    this.loadTimelinesForSelectedDate();
    this.onAppointmentFormClose();
  }

  onCreateSchedule(): void {
    this.selectedSchedule = null;
    this.showScheduleForm = true;
  }

  onEditSchedule(schedule: Schedule): void {
    this.selectedSchedule = schedule;
    this.showScheduleForm = true;
  }

  onEditAgenda(agenda: Agenda): void {
    // Primeiro fechar o modal se estiver aberto e limpar o schedule
    this.showScheduleForm = false;
    this.selectedSchedule = null;
    
    // Buscar a agenda completa da API para editar
    this.scheduleService.getScheduleById(agenda.id)
      .subscribe({
        next: (response) => {
          // A resposta já é o objeto Schedule diretamente, não response.schedule
          // Definir o schedule primeiro e aguardar para garantir que o Angular detecte a mudança
          this.selectedSchedule = (response as any).schedule || response as any;
          
          // Aguardar para garantir que o Angular processe a mudança no schedule
          // antes de abrir o modal
          setTimeout(() => {
            // Agora abrir o modal - o schedule já está definido
            this.showScheduleForm = true;
          }, 50);
        },
        error: (error) => {
          this.toastService.showError('Erro ao carregar agenda para edição.');
          console.error('Erro ao carregar agenda:', error);
        }
      });
  }
}
