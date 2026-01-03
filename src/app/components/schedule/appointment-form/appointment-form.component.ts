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
import { ButtonComponent } from '../../../shared/components/button/button.component';
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
    ButtonComponent,
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
      scheduleId: ['', [Validators.required]],
      date: ['', [Validators.required]],
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
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onDateChange());

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
        serviceControl?.setValue('');
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
            serviceControl?.setValue('');
            return;
          }

          // A resposta pode vir como { schedule: Schedule } ou diretamente como Schedule
          const schedule = response.schedule || response;
          
          if (!schedule || !schedule.id) {
            console.error('Agenda inválida na resposta:', response);
            this.availableServices = [];
            const serviceControl = this.appointmentForm.get('serviceId');
            serviceControl?.disable();
            serviceControl?.setValue('');
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
            serviceControl.enable();
            // Se o serviço atual não está na lista, limpar (exceto em modo de edição)
            if (!keepCurrentValue && currentServiceId && !this.availableServices.find(s => s.id === currentServiceId)) {
              serviceControl.setValue('');
            }
          } else {
            // Se não há serviços mas estamos em modo de edição, manter habilitado
            if (keepCurrentValue && currentServiceId) {
              serviceControl.enable();
            } else {
              serviceControl.disable();
              if (!keepCurrentValue) {
                serviceControl.setValue('');
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
            serviceControl?.setValue('');
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
        petControl?.setValue('');
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
            petControl?.enable();
            // Se não há valor atual ou o valor atual não está na lista, limpar
            if (!keepCurrentValue && (!currentPetId || !this.availablePets.find(p => p.id === currentPetId))) {
              petControl?.setValue('');
            }
          } else {
            // Se não há pets mas estamos em modo de edição, manter habilitado
            if (keepCurrentValue && currentPetId) {
              petControl?.enable();
            } else {
              petControl?.disable();
              petControl?.setValue('');
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
            petControl?.setValue('');
          }
        }
      });
  }

  private loadAvailableSlots(): void {
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
      return;
    }

    this.loadingSlots = true;
    this.scheduleService.getAvailableSlots(scheduleId, date, serviceId || undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // Verificar se a agenda funciona no dia
          if (response.available === false) {
            this.availableSlots = [];
            this.loadingSlots = false;
            const timeControl = this.appointmentForm.get('time');
            timeControl?.disable();
            timeControl?.setValue('');
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
          
          this.loadingSlots = false;
          
          // Habilitar campo de horário se houver slots ou se houver um horário pré-selecionado
          const timeControl = this.appointmentForm.get('time');
          if (this.availableSlots.length > 0 || preselectedTime) {
            timeControl?.enable();
            // Se houver um horário pré-selecionado, garantir que está selecionado
            if (preselectedTime) {
              timeControl?.setValue(preselectedTime);
            }
          } else {
            timeControl?.disable();
            timeControl?.setValue('');
          }
        },
        error: (error) => {
          console.error('Erro ao carregar horários disponíveis:', error);
          this.availableSlots = [];
          this.loadingSlots = false;
          const timeControl = this.appointmentForm.get('time');
          // Se houver um horário pré-selecionado, manter habilitado
          if (this.time) {
            this.availableSlots = [this.time];
            timeControl?.enable();
            timeControl?.setValue(this.time);
          } else {
            timeControl?.disable();
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
    this.loadAvailableSlots();
  }

  onTutorChange(): void {
    const tutorId = this.appointmentForm.get('clinicTutorId')?.value;
    // Limpar pet selecionado quando trocar tutor
    this.appointmentForm.patchValue({ petId: '' });
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

    // Habilitar o campo e definir o valor
    timeControl.enable();
    timeControl.setValue(time);
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
          
          // Habilitar campos antes de preencher (em modo de edição)
          this.appointmentForm.get('time')?.enable();
          // petId será habilitado após carregar os pets
          // serviceId será habilitado após carregar os serviços
          
          // Usar emitEvent: false para evitar disparar valueChanges durante carregamento
          this.appointmentForm.patchValue({
            scheduleId: appointment.scheduleId,
            date: appointmentDate.toISOString().split('T')[0],
            time: appointment.time,
            petId: appointment.petId,
            clinicTutorId: appointment.clinicTutorId,
            serviceId: appointment.serviceId,
            vetId: appointment.vetId || '',
            status: appointment.status,
            notes: appointment.notes || ''
          }, { emitEvent: false });

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
      timeControl?.enable();
    } else {
      timeControl?.disable();
    }
    this.appointmentForm.get('petId')?.disable();
    // serviceId será habilitado/desabilitado quando a agenda for selecionada
    // Não desabilitar aqui se já houver uma agenda pré-selecionada
    if (!this.scheduleId) {
      this.appointmentForm.get('serviceId')?.disable();
    }
    
    // Não carregar slots aqui - será carregado no ngOnChanges após patchValue
  }

  private updateModalConfig(): void {
    this.modalConfig.footerActions = [
      {
        label: 'Cancelar',
        variant: 'secondary',
        onClick: () => this.onClose()
      },
      {
        label: this.isEditMode ? 'Atualizar' : 'Criar',
        variant: 'primary',
        disabled: this.appointmentForm.invalid || this.submitting,
        loading: this.submitting,
        onClick: () => this.onSubmit()
      }
    ];
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.submitting = true;
    const formValue = this.appointmentForm.value;

    const appointmentData: CreateAppointmentRequest | UpdateAppointmentRequest = {
      date: formValue.date,
      time: formValue.time,
      petId: formValue.petId,
      clinicTutorId: formValue.clinicTutorId,
      serviceId: formValue.serviceId,
      scheduleId: formValue.scheduleId,
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
}

