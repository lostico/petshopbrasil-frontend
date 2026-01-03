import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleAppointment } from '../schedule-table/schedule-table.component';
import { TimelineSlot } from '../../../services/schedule.service';

export interface SlotClickEvent {
  hour: number;
  minute: number;
}

@Component({
  selector: 'app-schedule-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg border border-secondary-200 flex flex-col overflow-hidden">
      <!-- Cabeçalho do Recurso -->
      <div class="flex items-center justify-center gap-2 px-6 py-4 border-b border-secondary-200 flex-shrink-0">
        <div
          class="w-3 h-3 rounded-full flex-shrink-0"
          [style.background-color]="resourceColor">
        </div>
        <span class="text-sm font-medium text-secondary-900">
          {{ resourceName }}@if (resourceCategory) { ({{ resourceCategory }}) }
        </span>
      </div>

      <!-- Container Principal com Scroll -->
      <div class="flex relative overflow-y-auto scrollbar-visible" [style.max-height.px]="getMaxScrollHeight()">
        <!-- Linha do Tempo Vertical -->
        <div class="w-20 flex-shrink-0 border-r border-secondary-200 bg-secondary-50" style="height: {{ totalHeight }}px;">
          @for (slotMinutes of timeSlots; track slotMinutes; let i = $index) {
            <div
              class="border-b border-secondary-200 flex items-start justify-end pr-3 pt-1 transition-colors duration-150"
              [class.bg-primary-50]="hoveredSlotIndex === i"
              [class.border-primary-300]="hoveredSlotIndex === i"
              [style.height.px]="getIntervalHeight()">
              <span 
                class="text-xs font-medium transition-colors duration-150"
                [class.text-primary-700]="hoveredSlotIndex === i"
                [class.text-secondary-600]="hoveredSlotIndex !== i">
                {{ formatTimeSlot(slotMinutes) }}
              </span>
            </div>
          }
        </div>

        <!-- Área de Agendamentos -->
        <div
          class="flex-1 relative cursor-pointer"
          (click)="onGridClick($event)"
          (mousemove)="onGridMouseMove($event)"
          (mouseleave)="onGridMouseLeave()"
          style="height: {{ totalHeight }}px; min-height: {{ totalHeight }}px;">
          
          <!-- Linhas de Grade (bordas entre intervalos) -->
          @for (slotMinutes of timeSlots; track slotMinutes; let i = $index) {
            @if (i > 0) {
              <div
                class="absolute left-0 right-0 bg-secondary-200"
                [class.bg-primary-300]="hoveredSlotIndex === i"
                [class.hover-line]="hoveredSlotIndex === i"
                [style.top.px]="(i * getIntervalHeight()) - 1"
                style="height: 1px; transition: background-color 0.15s ease;">
              </div>
            }
          }

          <!-- Linha destacada no hover -->
          @if (hoveredSlotIndex !== null) {
            <div
              class="absolute left-0 right-0 bg-primary-200 opacity-50 pointer-events-none z-5"
              [style.top.px]="hoveredSlotIndex * getIntervalHeight()"
              style="height: {{ getIntervalHeight() }}px;">
            </div>
          }

          <!-- Linha do Horário Atual -->
          @if (currentTimePosition !== null) {
            <div
              class="absolute left-0 right-0 z-10 pointer-events-none"
              [style.top.px]="getCurrentTimeAbsolutePosition()">
              <!-- Círculo Vermelho (alinhado com linha do tempo à esquerda) -->
              <div class="absolute -left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full border-2 border-white z-10"></div>
              <!-- Linha Vermelha -->
              <div class="h-0.5 bg-red-500"></div>
            </div>
          }

          <!-- Agendamentos -->
          @for (appointment of appointments; track appointment.id) {
            <div
              class="appointment-block absolute left-2 right-2 rounded-md pb-2 pt-1 pl-2 pr-2 cursor-pointer transition-all hover:shadow-md z-20 overflow-hidden"
              [style.top.px]="getAppointmentTop(appointment)"
              [class]="getAppointmentClasses(appointment)"
              (click)="onAppointmentClick(appointment, $event)">
              <div class="text-xs font-medium text-white truncate">
                {{ appointment.time }} - {{ appointment.petName }} ({{ appointment.tutorName }}) - {{ appointment.service }}
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    
    .scrollbar-visible {
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 #f1f5f9;
    }
    
    .scrollbar-visible::-webkit-scrollbar {
      width: 12px;
    }
    
    .scrollbar-visible::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 6px;
    }
    
    .scrollbar-visible::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 6px;
      border: 2px solid #f1f5f9;
    }
    
    .scrollbar-visible::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    .hover-line {
      height: 2px !important;
      background-color: rgb(147 197 253) !important;
    }
  `]
})
export class ScheduleTimelineComponent implements OnInit, OnChanges {
  @Input() appointments: ScheduleAppointment[] = [];
  @Input() resourceName: string = '';
  @Input() resourceCategory: string = '';
  @Input() resourceColor: string = '#3B82F6';
  @Input() startHour: number = 9;
  @Input() endHour: number = 20;
  @Input() currentTime?: Date;
  @Input() intervalMinutes: number = 15; // Intervalo entre as linhas em minutos (15, 30, 60, etc.)
  @Input() slots: TimelineSlot[] = []; // Slots da API

  @Output() slotClick = new EventEmitter<SlotClickEvent>();
  @Output() appointmentClick = new EventEmitter<ScheduleAppointment>();

  timeSlots: number[] = []; // Slots baseados nos slots da API ou intervalo configurado (em minutos totais)
  totalHeight: number = 0;
  currentTimePosition: number | null = null;
  hoveredSlotIndex: number | null = null; // Índice do slot sendo hovered
  readonly intervalHeight: number = 30; // Altura fixa de cada intervalo em pixels

  ngOnInit(): void {
    this.generateTimeSlots();
    this.updateCurrentTimePosition();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['startHour'] || 
        changes['endHour'] || 
        changes['intervalMinutes'] ||
        changes['slots']) {
      this.generateTimeSlots();
      this.updateCurrentTimePosition();
    }
    
    if (changes['currentTime']) {
      this.updateCurrentTimePosition();
    }
  }

  generateTimeSlots(): void {
    // Se houver slots da API, usar eles para montar a timeline
    if (this.slots && this.slots.length > 0) {
      this.timeSlots = this.slots.map(slot => {
        const [hours, minutes] = slot.time.split(':').map(Number);
        return hours * 60 + minutes;
      });
      
      // Remover duplicatas e ordenar
      this.timeSlots = [...new Set(this.timeSlots)].sort((a, b) => a - b);
    } else {
      // Fallback: Gerar slots baseados no intervalo configurado
      this.timeSlots = [];
      const startMinutes = this.startHour * 60;
      const endMinutes = (this.endHour + 1) * 60; // Incluir a hora final
      
      for (let minutes = startMinutes; minutes < endMinutes; minutes += this.intervalMinutes) {
        this.timeSlots.push(minutes);
      }
    }
    
    // Calcular altura total usando altura fixa por intervalo
    this.totalHeight = this.timeSlots.length * this.intervalHeight;
  }

  getMaxScrollHeight(): number {
    // Altura máxima para scroll interno da timeline
    // Se o conteúdo for muito grande, limitar a altura para ativar scroll interno
    // Caso contrário, deixar crescer naturalmente e permitir scroll da página principal
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const headerHeight = 300; // Altura aproximada do cabeçalho, página e outros elementos
    const maxInternalHeight = viewportHeight - headerHeight;
    
    // Se o conteúdo for menor que a altura máxima interna, não limitar (deixar crescer)
    // Caso contrário, limitar para ativar scroll interno
    if (this.totalHeight <= maxInternalHeight) {
      return this.totalHeight;
    }
    
    // Limitar altura para ativar scroll interno quando conteúdo for muito grande
    return maxInternalHeight;
  }

  formatTimeSlot(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  getIntervalHeight(): number {
    return this.intervalHeight;
  }

  getCurrentTimeAbsolutePosition(): number {
    if (this.currentTimePosition === null) return 0;
    
    const timeToUse = this.currentTime || new Date();
    const now = new Date(timeToUse);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    // Encontrar o slot mais próximo ou a posição baseada nos slots
    if (this.timeSlots.length > 0) {
      const firstSlot = this.timeSlots[0];
      const relativeMinutes = currentMinutes - firstSlot;
      
      // Encontrar o índice do slot mais próximo
      let slotIndex = 0;
      for (let i = 0; i < this.timeSlots.length; i++) {
        if (this.timeSlots[i] <= currentMinutes) {
          slotIndex = i;
        } else {
          break;
        }
      }
      
      // Calcular posição interpolada entre slots
      if (slotIndex < this.timeSlots.length - 1) {
        const slotStart = this.timeSlots[slotIndex];
        const slotEnd = this.timeSlots[slotIndex + 1];
        const slotRange = slotEnd - slotStart;
        const positionInSlot = (currentMinutes - slotStart) / slotRange;
        return (slotIndex + positionInSlot) * this.intervalHeight;
      } else {
        return slotIndex * this.intervalHeight;
      }
    } else {
      // Fallback para cálculo baseado em intervalo fixo
      const startMinutes = this.startHour * 60;
      const relativeMinutes = currentMinutes - startMinutes;
      return (relativeMinutes / this.intervalMinutes) * this.intervalHeight;
    }
  }

  getAppointmentTop(appointment: ScheduleAppointment): number {
    const [appHours, appMins] = appointment.time.split(':').map(Number);
    const appTotalMinutes = appHours * 60 + appMins;
    
    // Se houver slots da API, encontrar a posição baseada neles
    if (this.timeSlots.length > 0) {
      const firstSlot = this.timeSlots[0];
      const relativeMinutes = appTotalMinutes - firstSlot;
      
      // Encontrar o índice do slot correspondente
      let slotIndex = 0;
      for (let i = 0; i < this.timeSlots.length; i++) {
        if (this.timeSlots[i] <= appTotalMinutes) {
          slotIndex = i;
        } else {
          break;
        }
      }
      
      // Se o horário corresponde exatamente a um slot, usar sua posição
      if (this.timeSlots[slotIndex] === appTotalMinutes) {
        return slotIndex * this.intervalHeight;
      }
      
      // Caso contrário, interpolar entre slots
      if (slotIndex < this.timeSlots.length - 1) {
        const slotStart = this.timeSlots[slotIndex];
        const slotEnd = this.timeSlots[slotIndex + 1];
        const slotRange = slotEnd - slotStart;
        const positionInSlot = slotRange > 0 ? (appTotalMinutes - slotStart) / slotRange : 0;
        return (slotIndex + positionInSlot) * this.intervalHeight;
      } else {
        return slotIndex * this.intervalHeight;
      }
    } else {
      // Fallback para cálculo baseado em intervalo fixo
      const startMinutes = this.startHour * 60;
      const relativeMinutes = appTotalMinutes - startMinutes;
      return (relativeMinutes / this.intervalMinutes) * this.intervalHeight;
    }
  }

  getAppointmentHeight(appointment: ScheduleAppointment): number {
    // Assumir 30 minutos padrão se não houver duração
    const duration = appointment.duration || 30; // minutos
    
    // Calcular altura baseada nos intervalos configurados
    const numberOfIntervals = duration / this.intervalMinutes;
    const calculatedHeight = numberOfIntervals * this.intervalHeight;
    
    // Garantir que a altura seja pelo menos a altura mínima necessária
    return Math.max(calculatedHeight, this.getMinAppointmentHeight());
  }

  getMinAppointmentHeight(): number {
    // Altura mínima para exibir todo o conteúdo sem scroll:
    // padding (p-2 = 8px top + 8px bottom = 16px)
    // + linha única com horário, pet, tutor e serviço (text-xs ~16px)
    // Total aproximado: 16 + 16 = 32px
    // Adicionando margem de segurança: 40px
    return 40;
  }

  getAppointmentClasses(appointment: ScheduleAppointment): string {
    const baseClasses = 'border-l-4';
    const statusColors: Record<string, string> = {
      'confirmed': 'bg-primary-500 border-primary-600',
      'pending': 'bg-warning-500 border-warning-600',
      'in-progress': 'bg-success-500 border-success-600',
      'completed': 'bg-secondary-500 border-secondary-600',
      'no-show': 'bg-danger-500 border-danger-600',
      'cancelled': 'bg-secondary-400 border-secondary-500'
    };
    return `${baseClasses} ${statusColors[appointment.status] || statusColors['pending']}`;
  }

  updateCurrentTimePosition(): void {
    const timeToUse = this.currentTime || new Date();
    const now = new Date(timeToUse);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = this.startHour * 60;
    const endMinutes = (this.endHour + 1) * 60;
    
    if (currentMinutes < startMinutes || currentMinutes > endMinutes) {
      this.currentTimePosition = null;
      return;
    }
    
    // Armazenar os minutos atuais para cálculo da posição
    this.currentTimePosition = currentMinutes;
  }

  onGridClick(event: MouseEvent): void {
    // Verificar se o clique foi em um agendamento
    const target = event.target as HTMLElement;
    const appointmentElement = target.closest('.appointment-block');
    if (appointmentElement) {
      // Clique foi em um agendamento, não processar aqui
      return;
    }

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const y = event.clientY - rect.top;
    
    let clickedHour: number;
    let clickedMinute: number;
    
    // Se houver slots da API, usar o horário exato do slot correspondente à linha
    if (this.timeSlots.length > 0) {
      // Calcular qual slot foi clicado baseado na posição Y
      const slotIndex = Math.floor(y / this.intervalHeight);
      
      if (slotIndex >= 0 && slotIndex < this.timeSlots.length) {
        // Usar o horário exato do slot, sem interpolação
        const slotMinutes = this.timeSlots[slotIndex];
        clickedHour = Math.floor(slotMinutes / 60);
        clickedMinute = slotMinutes % 60;
      } else {
        return; // Clique fora dos slots
      }
    } else {
      // Fallback: Calcular minutos baseado na posição Y e altura do intervalo
      const clickedMinutes = (y / this.intervalHeight) * this.intervalMinutes;
      const startMinutes = this.startHour * 60;
      const totalClickedMinutes = startMinutes + clickedMinutes;
      
      // Arredondar para o slot mais próximo (usando o intervalo configurado)
      const roundedMinutes = Math.round(totalClickedMinutes / this.intervalMinutes) * this.intervalMinutes;
      clickedHour = Math.floor(roundedMinutes / 60);
      clickedMinute = roundedMinutes % 60;
    }
    
    if (clickedHour >= this.startHour && clickedHour <= this.endHour) {
      this.slotClick.emit({ hour: clickedHour, minute: clickedMinute });
    }
  }

  onAppointmentClick(appointment: ScheduleAppointment, event: MouseEvent): void {
    event.stopPropagation();
    this.appointmentClick.emit(appointment);
  }

  onGridMouseMove(event: MouseEvent): void {
    // Verificar se o mouse está sobre um agendamento
    const target = event.target as HTMLElement;
    const appointmentElement = target.closest('.appointment-block');
    if (appointmentElement) {
      // Mouse está sobre um agendamento, não destacar linha
      this.hoveredSlotIndex = null;
      return;
    }

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const y = event.clientY - rect.top;
    
    // Calcular qual slot está sendo hovered
    const slotIndex = Math.floor(y / this.intervalHeight);
    
    if (slotIndex >= 0 && slotIndex < this.timeSlots.length) {
      this.hoveredSlotIndex = slotIndex;
    } else {
      this.hoveredSlotIndex = null;
    }
  }

  onGridMouseLeave(): void {
    this.hoveredSlotIndex = null;
  }
}