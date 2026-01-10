import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { AppointmentService, Appointment, CreateAppointmentRequest, UpdateAppointmentRequest } from '../../../services/appointment.service';
import { ScheduleService, Schedule } from '../../../services/schedule.service';
import { ServiceService, Service } from '../../../services/service.service';
import { PetService, Pet } from '../../../services/pet.service';
import { TutorService, Tutor } from '../../../services/tutor.service';
import { ToastService } from '../../../shared/services/toast.service';
import { InputComponent } from '../../../shared/components/input/input.component';
import { TextareaComponent } from '../../../shared/components/textarea/textarea.component';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { ModalComponent, ModalConfig, ModalAction } from '../../../shared/components/modal/modal.component';
import { CardComponent } from '../../../shared/components/card/card.component';

const APPOINTMENT_STATUSES = [
  { value: 'SCHEDULED', label: 'Agendado' },
  { value: 'CONFIRMED', label: 'Confirmado' },
  { value: 'IN_PROGRESS', label: 'Em Andamento' },
  { value: 'COMPLETED', label: 'Concluído' },
  { value: 'NO_SHOW', label: 'Não Compareceu' },
  { value: 'CANCELLED', label: 'Cancelado' }
];

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    TextareaComponent,
    SelectComponent,
    ModalComponent,
    CardComponent
  ],
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent implements OnInit, OnDestroy, OnChanges {
  @Input() appointment: Appointment | null = null;
  @Input() scheduleId: string | null = null;
  @Input() date: string | null = null; // YYYY-MM-DD
  @Input() time: string | null = null; // HH:mm
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Appointment>();

  appointmentForm!: FormGroup;
  loading = false;
  submitting = false;
  isEditMode = false;
  availableSchedules: Schedule[] = [];
  availableServices: Service[] = [];
  availablePets: Pet[] = [];
  availableTutors: Tutor[] = [];
  availableSlots: string[] = [];
  loadingSlots = false;
  private isInitializing = false; // Flag para evitar chamadas durante inicialização
  private isLoadingSlots = false; // Flag para evitar múltiplas chamadas simultâneas de loadAvailableSlots
  private lastSlotRequest: { scheduleId: string; date: string; serviceId?: string } | null = null; // Cache da última requisição

  modalConfig: ModalConfig = {
    title: 'Novo Agendamento',
    size: 'lg',
    showCloseButton: true,
    closeOnOverlayClick: false,
    showFooter: true,
    footerActions: []
  };

  statuses = APPOINTMENT_STATUSES;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private scheduleService: ScheduleService,
    private serviceService: ServiceService,
    private petService: PetService,
    private tutorService: TutorService,
    private toastService: ToastService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadSchedules();
    // Não carregar todos os serviços - serão carregados baseados na agenda selecionada
    this.updateModalConfig();
    
    // Observar mudanças no status do formulário para atualizar o botão
    this.appointmentForm.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateModalConfig();
      });
    
    // Observar mudanças nos valores do formulário para atualizar o botão
    this.appointmentForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateModalConfig();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appointment'] || changes['isOpen'] || changes['scheduleId'] || changes['date'] || changes['time']) {
      if (this.isOpen && this.appointmentForm) {
        if (this.appointment) {
          this.isEditMode = true;
          this.modalConfig.title = 'Editar Agendamento';
          this.loadAppointmentData();
        } else {
          this.isEditMode = false;
          this.modalConfig.title = 'Novo Agendamento';
          this.isInitializing = true; // Marcar início da inicialização
          this.resetForm();
          
          // Preencher valores iniciais se fornecidos
          // Ordem importante: scheduleId -> date -> time
          // Usar emitEvent: false para evitar disparar valueChanges durante inicialização
          if (this.scheduleId) {
            this.appointmentForm.patchValue({ scheduleId: this.scheduleId }, { emitEvent: false });
          }
          if (this.date) {
            this.appointmentForm.patchValue({ date: this.date }, { emitEvent: false });
          }
          if (this.time) {
            // Adicionar o horário à lista de slots imediatamente
            this.availableSlots = [this.time];
            const timeControl = this.appointmentForm.get('time');
            timeControl?.enable();
            this.appointmentForm.patchValue({ time: this.time }, { emitEvent: false });
          }
          
          // Carregar serviços da agenda se houver scheduleId
          if (this.scheduleId) {
            this.loadServicesForSchedule(this.scheduleId);
          }
          
          // Carregar slots disponíveis após definir scheduleId e date
          if (this.scheduleId && this.date) {
            this.loadAvailableSlots();
          }
          
          this.isInitializing = false; // Marcar fim da inicialização
        }
        this.updateModalConfig();
      }
    }
  }

  private initForm(): void {
    this.appointmentForm = this.fb.group({
      scheduleId: [''], // Opcional conforme documentação da API
      date: ['', [Validators.required, this.dateNotInPastValidator.bind(this)]],
      time: [{ value: '', disabled: true }, [Validators.required]], // Desabilitado inicialmente
      petId: [{ value: '', disabled: true }, [Validators.required]], // Desabilitado inicialmente
      clinicTutorId: ['', [Validators.required]],
      serviceId: [{ value: '', disabled: true }, [Validators.required]], // Desabilitado inicialmente - será habilitado quando agenda for selecionada
      vetId: [''],
      status: ['SCHEDULED'],
      notes: ['']
    });

    // Observar mudanças para carregar slots disponíveis
    this.appointmentForm.get('scheduleId')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onScheduleChange());

    this.appointmentForm.get('date')?.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        // Evitar chamadas durante inicialização
        if (this.isInitializing) {
          return;
        }
        // Revalidar data quando mudar (sem emitEvent para evitar loop)
        const dateControl = this.appointmentForm.get('date');
        if (dateControl) {
          const currentValue = dateControl.value;
          dateControl.updateValueAndValidity({ emitEvent: false });
          // Restaurar valor se foi alterado pela validação
          if (dateControl.value !== currentValue) {
            dateControl.setValue(currentValue, { emitEvent: false });
          }
        }
        this.onDateChange();
      });

    // Revalidar data quando o horário mudar (para validar data+hora combinadas)
    this.appointmentForm.get('time')?.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        // Evitar chamadas durante inicialização
        if (this.isInitializing) {
          return;
        }
        // Revalidar data sem emitir evento para evitar loop
        const dateControl = this.appointmentForm.get('date');
        if (dateControl && dateControl.value) {
          dateControl.updateValueAndValidity({ emitEvent: false });
        }
      });

    this.appointmentForm.get('clinicTutorId')?.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.onTutorChange());
  }

  private loadSchedules(): void {
    this.scheduleService.getSchedules({ isActive: true })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.availableSchedules = response.schedules || [];
        },
        error: (error) => {
          console.error('Erro ao carregar agendas:', error);
        }
      });
  }

  private loadServicesForSchedule(scheduleId: string, keepCurrentValue: boolean = false): void {
    if (!scheduleId) {
      this.availableServices = [];
      const serviceControl = this.appointmentForm.get('serviceId');
      if (!keepCurrentValue) {
        serviceControl?.disable();
        serviceControl?.setValue('', { emitEvent: false });
      }
      return;
    }

    // Buscar a agenda completa para obter os serviços configurados
    this.scheduleService.getScheduleById(scheduleId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // Verificar se a resposta tem a estrutura esperada
          if (!response) {
            console.error('Resposta vazia ao buscar agenda');
            this.availableServices = [];
            const serviceControl = this.appointmentForm.get('serviceId');
            serviceControl?.disable();
            serviceControl?.setValue('', { emitEvent: false });
            return;
          }

          // A resposta pode vir como { schedule: Schedule } ou diretamente como Schedule
          const schedule = response.schedule || response;
          
          if (!schedule || !schedule.id) {
            console.error('Agenda inválida na resposta:', response);
            this.availableServices = [];
            const serviceControl = this.appointmentForm.get('serviceId');
            serviceControl?.disable();
            serviceControl?.setValue('', { emitEvent: false });
            return;
          }
          
          // Filtrar apenas serviços ativos da agenda
          const scheduleServices = (schedule.scheduleServices || [])
            .filter(ss => ss.isActive && ss.service)
            .map(ss => ss.service);
          
          // Converter para o formato Service esperado
          this.availableServices = scheduleServices.map(ss => ({
            id: ss.id,
            name: ss.name,
            category: ss.category as any, // Converter string para ServiceCategory
            // Campos opcionais que podem não estar presentes
            description: '',
            duration: 0,
            price: 0,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          } as Service));
          
          // Habilitar/desabilitar campo de serviço baseado na disponibilidade
          const serviceControl = this.appointmentForm.get('serviceId');
          if (!serviceControl) {
            console.error('Campo serviceId não encontrado no formulário');
            return;
          }
          
          const currentServiceId = serviceControl.value;
          
          if (this.availableServices.length > 0) {
            // Sempre habilitar se houver serviços disponíveis
            if (serviceControl.disabled) {
              serviceControl.enable({ emitEvent: false });
              serviceControl.updateValueAndValidity({ emitEvent: false });
            }
            // Se o serviço atual não está na lista, limpar (exceto em modo de edição)
            if (!keepCurrentValue && currentServiceId && !this.availableServices.find(s => s.id === currentServiceId)) {
              serviceControl.setValue('', { emitEvent: false });
            }
            // Atualizar status do formulário
            this.appointmentForm.updateValueAndValidity();
            this.updateModalConfig();
          } else {
            // Se não há serviços mas estamos em modo de edição, manter habilitado
            if (keepCurrentValue && currentServiceId) {
              serviceControl.enable();
            } else {
              serviceControl.disable();
              if (!keepCurrentValue) {
                serviceControl.setValue('', { emitEvent: false });
              }
            }
          }
        },
        error: (error) => {
          console.error('Erro ao carregar serviços da agenda:', error);
          this.availableServices = [];
          const serviceControl = this.appointmentForm.get('serviceId');
          // Em modo de edição, manter habilitado se já houver valor
          if (!keepCurrentValue || !serviceControl?.value) {
            serviceControl?.disable();
            serviceControl?.setValue('', { emitEvent: false });
          }
        }
      });
  }

  private loadTutors(): void {
    this.tutorService.getTutors({ limit: 100 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // Filtrar apenas tutores ativos
          this.availableTutors = (response.data || []).filter(tutor => 
            !tutor.status || tutor.status === 'ACTIVE'
          );
        },
        error: (error) => {
          console.error('Erro ao carregar clientes:', error);
        }
      });
  }

  private loadPetsByTutor(tutorId: string, keepCurrentValue: boolean = false): void {
    if (!tutorId) {
      this.availablePets = [];
      const petControl = this.appointmentForm.get('petId');
      if (!keepCurrentValue) {
        petControl?.disable();
        petControl?.setValue('', { emitEvent: false });
      }
      return;
    }

    this.petService.getPetsByOwner(tutorId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pets) => {
          this.availablePets = Array.isArray(pets) ? pets : [];
          // Habilitar/desabilitar campo de pet baseado na disponibilidade
          const petControl = this.appointmentForm.get('petId');
          const currentPetId = petControl?.value;
          
          if (this.availablePets.length > 0) {
            if (petControl && petControl.disabled) {
              petControl.enable({ emitEvent: false });
              petControl.updateValueAndValidity({ emitEvent: false });
            }
            // Se não há valor atual ou o valor atual não está na lista, limpar
            if (!keepCurrentValue && (!currentPetId || !this.availablePets.find(p => p.id === currentPetId))) {
              petControl?.setValue('', { emitEvent: false });
            }
            // Atualizar status do formulário
            this.appointmentForm.updateValueAndValidity();
            this.updateModalConfig();
          } else {
            // Se não há pets mas estamos em modo de edição, manter habilitado
            if (keepCurrentValue && currentPetId) {
              petControl?.enable();
            } else {
              petControl?.disable();
              petControl?.setValue('', { emitEvent: false });
            }
          }
        },
        error: (error) => {
          console.error('Erro ao carregar pets:', error);
          this.availablePets = [];
          const petControl = this.appointmentForm.get('petId');
          // Em modo de edição, manter habilitado se já houver valor
          if (!keepCurrentValue || !petControl?.value) {
            petControl?.disable();
            petControl?.setValue('', { emitEvent: false });
          }
        }
      });
  }

  private loadAvailableSlots(): void {
    // Evitar chamadas durante inicialização
    if (this.isInitializing) {
      return;
    }

    // Evitar múltiplas chamadas simultâneas
    if (this.isLoadingSlots) {
      return;
    }

    const scheduleId = this.appointmentForm.get('scheduleId')?.value;
    const date = this.appointmentForm.get('date')?.value;
    const serviceId = this.appointmentForm.get('serviceId')?.value;
    const currentTimeValue = this.appointmentForm.get('time')?.value; // Preservar valor atual

    if (!scheduleId || !date) {
      this.availableSlots = [];
      const timeControl = this.appointmentForm.get('time');
      // Só desabilitar se não houver um valor pré-definido
      if (!this.time && !currentTimeValue) {
        timeControl?.disable();
      }
      this.lastSlotRequest = null;
      return;
    }

    // Verificar se é a mesma requisição da última vez
    const currentRequest = { scheduleId, date, serviceId: serviceId || undefined };
    if (this.lastSlotRequest && 
        this.lastSlotRequest.scheduleId === currentRequest.scheduleId &&
        this.lastSlotRequest.date === currentRequest.date &&
        this.lastSlotRequest.serviceId === currentRequest.serviceId) {
      // Mesma requisição, não fazer chamada novamente
      return;
    }

    this.isLoadingSlots = true;
    this.loadingSlots = true;
    this.lastSlotRequest = currentRequest;

    this.scheduleService.getAvailableSlots(scheduleId, date, serviceId || undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoadingSlots = false;
          this.loadingSlots = false;

          // Verificar se a agenda funciona no dia
          if (response.available === false) {
            this.availableSlots = [];
            const timeControl = this.appointmentForm.get('time');
            timeControl?.disable();
            timeControl?.setValue('', { emitEvent: false });
            return;
          }

          // Usar availableSlots da resposta (já filtrados)
          this.availableSlots = response.availableSlots
            .map(slot => slot.time);
          
          // Se houver um horário pré-selecionado (passado via input), adicionar à lista se não estiver presente
          const preselectedTime = this.time || currentTimeValue;
          if (preselectedTime && !this.availableSlots.includes(preselectedTime)) {
            this.availableSlots.push(preselectedTime);
            this.availableSlots.sort(); // Ordenar novamente
          }
          
          // Habilitar campo de horário se houver slots ou se houver um horário pré-selecionado
          const timeControl = this.appointmentForm.get('time');
          if (this.availableSlots.length > 0 || preselectedTime) {
            if (timeControl && timeControl.disabled) {
              timeControl.enable({ emitEvent: false });
              timeControl.updateValueAndValidity({ emitEvent: false });
            }
            // Se houver um horário pré-selecionado, garantir que está selecionado (sem emitir evento)
            if (preselectedTime && timeControl?.value !== preselectedTime) {
              timeControl?.setValue(preselectedTime, { emitEvent: false });
            }
            // Atualizar status do formulário
            this.appointmentForm.updateValueAndValidity();
            this.updateModalConfig();
          } else {
            timeControl?.disable();
            if (timeControl?.value) {
              timeControl?.setValue('', { emitEvent: false });
            }
          }
        },
        error: (error) => {
          this.isLoadingSlots = false;
          this.loadingSlots = false;
          console.error('Erro ao carregar horários disponíveis:', error);
          this.availableSlots = [];
          const timeControl = this.appointmentForm.get('time');
          // Se houver um horário pré-selecionado, manter habilitado
          if (this.time) {
            this.availableSlots = [this.time];
            timeControl?.enable();
            if (timeControl?.value !== this.time) {
              timeControl?.setValue(this.time, { emitEvent: false });
            }
          } else {
            timeControl?.disable();
            if (timeControl?.value) {
              timeControl?.setValue('', { emitEvent: false });
            }
          }
        }
      });
  }

  onScheduleChange(): void {
    // Evitar chamadas durante inicialização
    if (this.isInitializing) {
      return;
    }
    
    const scheduleId = this.appointmentForm.get('scheduleId')?.value;
    
    // Resetar cache de slots quando agenda mudar
    this.lastSlotRequest = null;
    
    // Carregar serviços da agenda selecionada (a limpeza será feita dentro do método)
    this.loadServicesForSchedule(scheduleId);
    
    // Carregar slots disponíveis
    this.loadAvailableSlots();
  }

  onDateChange(): void {
    // Evitar chamadas durante inicialização
    if (this.isInitializing) {
      return;
    }
    
    // Resetar cache de slots quando data mudar
    this.lastSlotRequest = null;
    
    this.loadAvailableSlots();
  }

  onTutorChange(): void {
    // Evitar chamadas durante inicialização
    if (this.isInitializing) {
      return;
    }

    const tutorId = this.appointmentForm.get('clinicTutorId')?.value;
    // Limpar pet selecionado quando trocar tutor (sem emitir evento para evitar loops)
    this.appointmentForm.patchValue({ petId: '' }, { emitEvent: false });
    // Desabilitar temporariamente enquanto carrega os pets
    const petControl = this.appointmentForm.get('petId');
    petControl?.disable();
    // Carregar pets do tutor (a habilitação será feita no callback)
    this.loadPetsByTutor(tutorId);
  }

  private setTimeValue(time: string): void {
    const timeControl = this.appointmentForm.get('time');
    if (!timeControl) return;

    // Adicionar o horário à lista de slots disponíveis se não estiver presente
    if (!this.availableSlots.includes(time)) {
      this.availableSlots.push(time);
      this.availableSlots.sort();
    }

    // Habilitar o campo e definir o valor (sem emitir evento para evitar loops)
    timeControl.enable();
    timeControl.setValue(time, { emitEvent: false });
  }

  private loadAppointmentData(): void {
    if (!this.appointment) return;

    this.loading = true;
    this.isInitializing = true; // Marcar início da inicialização

    this.appointmentService.getAppointmentById(this.appointment.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const appointment = response.appointment;
          
          // Carregar tutor e pets primeiro
          if (appointment.clinicTutorId) {
            // Em modo de edição, manter o valor atual do pet se existir
            this.loadPetsByTutor(appointment.clinicTutorId, true);
          }
          this.loadTutors();
          
          // Carregar serviços da agenda antes de preencher o formulário
          // Em modo de edição, manter o valor atual do serviço se existir
          if (appointment.scheduleId) {
            this.loadServicesForSchedule(appointment.scheduleId, true);
          }

          // Preencher formulário
          const appointmentDate = new Date(appointment.date);
          
          // Extrair data e hora do formato ISO 8601
          const dateStr = appointmentDate.toISOString().split('T')[0]; // YYYY-MM-DD
          const timeStr = appointment.time || appointmentDate.toTimeString().slice(0, 5); // HH:mm
          
          // Habilitar campos antes de preencher (em modo de edição)
          this.appointmentForm.get('time')?.enable();
          // petId será habilitado após carregar os pets
          // serviceId será habilitado após carregar os serviços
          
          // Usar emitEvent: false para evitar disparar valueChanges durante carregamento
          this.appointmentForm.patchValue({
            scheduleId: appointment.scheduleId || '',
            date: dateStr,
            time: timeStr,
            petId: appointment.petId,
            clinicTutorId: appointment.clinicTutorId,
            serviceId: appointment.serviceId,
            vetId: appointment.vetId || '',
            status: appointment.status,
            notes: appointment.notes || ''
          }, { emitEvent: false });

          // Atualizar status do formulário após preencher
          this.appointmentForm.updateValueAndValidity();
          this.updateModalConfig();

          this.loadAvailableSlots();
          this.isInitializing = false; // Marcar fim da inicialização
          this.loading = false;
        },
        error: (error) => {
          this.isInitializing = false; // Garantir que a flag seja resetada em caso de erro
          this.toastService.showError('Erro ao carregar agendamento. Tente novamente.');
          this.loading = false;
          console.error('Erro ao carregar agendamento:', error);
        }
      });
  }

  private resetForm(): void {
    this.appointmentForm.reset({
      scheduleId: this.scheduleId || '',
      date: this.date || '',
      time: this.time || '',
      petId: '',
      clinicTutorId: '',
      serviceId: '',
      vetId: '',
      status: 'SCHEDULED',
      notes: ''
    });
    this.availablePets = [];
    this.availableSlots = [];
    this.availableServices = [];
    this.loadTutors();
    
    // Desabilitar campos que dependem de outros
    // Se houver um horário pré-selecionado, manter habilitado
    const timeControl = this.appointmentForm.get('time');
    if (this.time) {
      this.availableSlots = [this.time];
      if (timeControl && timeControl.disabled) {
        timeControl.enable({ emitEvent: false });
        timeControl.updateValueAndValidity({ emitEvent: false });
      }
    } else {
      timeControl?.disable();
    }
    this.appointmentForm.get('petId')?.disable();
    // Atualizar status do formulário
    this.appointmentForm.updateValueAndValidity();
    // serviceId será habilitado/desabilitado quando a agenda for selecionada
    // Não desabilitar aqui se já houver uma agenda pré-selecionada
    if (!this.scheduleId) {
      this.appointmentForm.get('serviceId')?.disable();
    }
    
    // Não carregar slots aqui - será carregado no ngOnChanges após patchValue
  }

  private updateModalConfig(): void {
    // Usar setTimeout para garantir que as mudanças no formulário foram processadas
    setTimeout(() => {
      const isFormValid = this.isFormValid();
      
      this.modalConfig.footerActions = [
        {
          label: 'Cancelar',
          variant: 'secondary',
          onClick: () => this.onClose()
        },
        {
          label: this.isEditMode ? 'Atualizar' : 'Criar',
          variant: 'primary',
          disabled: !isFormValid || this.submitting,
          loading: this.submitting,
          onClick: () => this.onSubmit()
        }
      ];
    }, 0);
  }


  /**
   * Verifica se o formulário está válido, considerando campos desabilitados
   * Campos desabilitados não são validados pelo Angular, então precisamos verificar manualmente
   */
  private isFormValid(): boolean {
    if (!this.appointmentForm) {
      return false;
    }

    // Verificar campos obrigatórios
    const date = this.appointmentForm.get('date');
    const time = this.appointmentForm.get('time');
    const petId = this.appointmentForm.get('petId');
    const clinicTutorId = this.appointmentForm.get('clinicTutorId');
    const serviceId = this.appointmentForm.get('serviceId');

    // Data é obrigatória e deve ter valor válido
    if (!date || !date.value) {
      return false;
    }
    // Verificar se há erro de validação (exceto se não foi tocado ainda)
    if (date.invalid && date.errors && !date.errors['dateInPast']) {
      // Se tem erro que não é dateInPast, não é válido
      return false;
    }

    // Cliente é obrigatório e deve ter valor
    if (!clinicTutorId || !clinicTutorId.value) {
      return false;
    }

    // Pet é obrigatório - verificar se está habilitado e tem valor
    if (petId) {
      if (petId.enabled) {
        // Se está habilitado, deve ter valor
        if (!petId.value) {
          return false;
        }
      } else {
        // Se está desabilitado, verificar se deveria estar habilitado
        // Se há pets disponíveis, deveria estar habilitado
        if (this.availablePets.length > 0) {
          return false;
        }
        // Se não há pets mas há tutor selecionado, não pode criar agendamento
        if (clinicTutorId.value && this.availablePets.length === 0) {
          return false;
        }
      }
    }

    // Horário é obrigatório - verificar se está habilitado e tem valor
    if (time) {
      if (time.enabled) {
        // Se está habilitado, deve ter valor
        if (!time.value) {
          return false;
        }
      } else {
        // Se está desabilitado, verificar se deveria estar habilitado
        // Se há slots disponíveis, deveria estar habilitado
        if (this.availableSlots.length > 0 && date.value) {
          return false;
        }
        // Se não há slots mas há data selecionada, não pode criar agendamento
        if (date.value && this.availableSlots.length === 0 && !this.loadingSlots) {
          return false;
        }
      }
    }

    // Serviço é obrigatório - verificar se está habilitado e tem valor
    if (serviceId) {
      if (serviceId.enabled) {
        // Se está habilitado, deve ter valor
        if (!serviceId.value) {
          return false;
        }
      } else {
        // Se está desabilitado, verificar se deveria estar habilitado
        // Se há serviços disponíveis, deveria estar habilitado
        if (this.availableServices.length > 0) {
          return false;
        }
        // Se não há serviços mas há agenda selecionada, não pode criar agendamento
        const scheduleId = this.appointmentForm.get('scheduleId')?.value;
        if (scheduleId && this.availableServices.length === 0) {
          return false;
        }
      }
    }

    // Se chegou aqui, todos os campos obrigatórios estão válidos
    return true;
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.submitting = true;
    const formValue = this.appointmentForm.value;

    // Combinar date (YYYY-MM-DD) e time (HH:mm) em formato ISO 8601
    const dateTimeISO = this.combineDateAndTime(formValue.date, formValue.time);

    const appointmentData: CreateAppointmentRequest | UpdateAppointmentRequest = {
      date: dateTimeISO,
      petId: formValue.petId,
      clinicTutorId: formValue.clinicTutorId,
      serviceId: formValue.serviceId,
      scheduleId: formValue.scheduleId || null,
      vetId: formValue.vetId || null,
      notes: formValue.notes || null
    };

    if (this.isEditMode && this.appointment) {
      const updateData: UpdateAppointmentRequest = {
        ...appointmentData,
        status: formValue.status
      };
      this.updateAppointment(updateData);
    } else {
      this.createAppointment(appointmentData as CreateAppointmentRequest);
    }
  }

  /**
   * Validador customizado para verificar se a data não é no passado
   * Quando há horário selecionado, valida a data e hora combinadas
   */
  private dateNotInPastValidator(control: any): { [key: string]: any } | null {
    if (!control.value) {
      return null; // Validação de required é feita separadamente
    }

    const date = control.value; // YYYY-MM-DD
    const timeControl = this.appointmentForm?.get('time');
    const time = timeControl?.value; // HH:mm

    // Se não há horário, validar apenas a data (não pode ser antes de hoje)
    if (!time) {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return { dateInPast: true };
      }
      return null;
    }

    // Se há horário, validar data e hora combinadas
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    const selectedDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0);
    const now = new Date();

    if (selectedDateTime < now) {
      return { dateInPast: true };
    }

    return null;
  }

  /**
   * Combina data (YYYY-MM-DD) e horário (HH:mm) em formato ISO 8601
   * @param date Data no formato YYYY-MM-DD
   * @param time Horário no formato HH:mm
   * @returns Data e horário combinados em formato ISO 8601 (UTC)
   */
  private combineDateAndTime(date: string, time: string): string {
    if (!date || !time) {
      throw new Error('Data e horário são obrigatórios');
    }

    // Criar objeto Date com a data e hora local
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    
    // Criar data no timezone local
    const localDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
    
    // Converter para ISO 8601 (UTC)
    return localDate.toISOString();
  }

  private createAppointment(appointmentData: CreateAppointmentRequest): void {
    this.appointmentService.createAppointment(appointmentData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.toastService.showSuccess('Agendamento criado com sucesso!');
          this.submitting = false;
          this.saved.emit(response.appointment);
          this.onClose();
        },
        error: (error) => {
          this.handleError(error, 'Erro ao criar agendamento.');
        }
      });
  }

  private updateAppointment(appointmentData: UpdateAppointmentRequest): void {
    if (!this.appointment) return;

    this.appointmentService.updateAppointment(this.appointment.id, appointmentData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.toastService.showSuccess('Agendamento atualizado com sucesso!');
          this.submitting = false;
          this.saved.emit(response.appointment);
          this.onClose();
        },
        error: (error) => {
          this.handleError(error, 'Erro ao atualizar agendamento.');
        }
      });
  }

  private handleError(error: any, defaultMessage: string): void {
    this.submitting = false;
    
    if (error.error?.message) {
      this.toastService.showError(error.error.message);
    } else if (error.error?.errors && Array.isArray(error.error.errors)) {
      this.toastService.showError(error.error.errors.map((e: any) => e.message).join(', '));
    } else {
      this.toastService.showError(defaultMessage);
    }
    
    console.error('Erro na operação:', error);
  }

  onClose(): void {
    this.close.emit();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.appointmentForm.controls).forEach(key => {
      const control = this.appointmentForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para validação
  get scheduleIdControl() {
    return this.appointmentForm.get('scheduleId');
  }

  get dateControl() {
    return this.appointmentForm.get('date');
  }

  get timeControl() {
    return this.appointmentForm.get('time');
  }

  get petIdControl() {
    return this.appointmentForm.get('petId');
  }

  get clinicTutorIdControl() {
    return this.appointmentForm.get('clinicTutorId');
  }

  get serviceIdControl() {
    return this.appointmentForm.get('serviceId');
  }

  // Getters para opções formatadas
  get scheduleOptions() {
    return this.availableSchedules.map(s => ({ value: s.id, label: s.name }));
  }

  get slotOptions() {
    return this.availableSlots.map(t => ({ value: t, label: t }));
  }

  get tutorOptions() {
    return this.availableTutors.map(t => ({ value: t.id, label: t.name }));
  }

  get petOptions() {
    return this.availablePets.map(p => ({ value: p.id, label: p.name }));
  }

  get serviceOptions() {
    return this.availableServices.map(s => ({ value: s.id, label: s.name }));
  }

  /**
   * Retorna mensagem de erro para o campo de data
   */
  getDateErrorMessage(): string {
    const control = this.dateControl;
    if (!control || !control.touched) {
      return '';
    }

    if (control.hasError('required')) {
      return 'Data é obrigatória';
    }

    if (control.hasError('dateInPast')) {
      return 'Não é possível agendar para datas passadas';
    }

    return '';
  }
}

