import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
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
    this.loadServices();
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
          this.resetForm();
          
          // Preencher valores iniciais se fornecidos
          if (this.scheduleId) {
            this.appointmentForm.patchValue({ scheduleId: this.scheduleId });
            this.onScheduleChange();
          }
          if (this.date) {
            this.appointmentForm.patchValue({ date: this.date });
            this.onDateChange();
          }
          if (this.time) {
            this.appointmentForm.patchValue({ time: this.time });
          }
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
      serviceId: ['', [Validators.required]],
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
      .pipe(takeUntil(this.destroy$))
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

  private loadServices(): void {
    this.serviceService.getAllServices({ isActive: true })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.availableServices = response.data || [];
        },
        error: (error) => {
          console.error('Erro ao carregar serviços:', error);
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

  private loadPetsByTutor(tutorId: string): void {
    if (!tutorId) {
      this.availablePets = [];
      return;
    }

    this.petService.getPetsByOwner(tutorId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pets) => {
          this.availablePets = Array.isArray(pets) ? pets : [];
        },
        error: (error) => {
          console.error('Erro ao carregar pets:', error);
          this.availablePets = [];
        }
      });
  }

  private loadAvailableSlots(): void {
    const scheduleId = this.appointmentForm.get('scheduleId')?.value;
    const date = this.appointmentForm.get('date')?.value;
    const serviceId = this.appointmentForm.get('serviceId')?.value;

    if (!scheduleId || !date) {
      this.availableSlots = [];
      const timeControl = this.appointmentForm.get('time');
      timeControl?.disable();
      return;
    }

    this.loadingSlots = true;
    this.appointmentService.getAvailableSlots({
      scheduleId,
      date,
      serviceId: serviceId || undefined
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.availableSlots = response.slots
            .filter(slot => slot.available)
            .map(slot => slot.time);
          this.loadingSlots = false;
          // Habilitar/desabilitar campo de horário baseado na disponibilidade
          const timeControl = this.appointmentForm.get('time');
          if (this.availableSlots.length > 0) {
            timeControl?.enable();
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
          timeControl?.disable();
        }
      });
  }

  onScheduleChange(): void {
    this.loadAvailableSlots();
  }

  onDateChange(): void {
    this.loadAvailableSlots();
  }

  onTutorChange(): void {
    const tutorId = this.appointmentForm.get('clinicTutorId')?.value;
    this.loadPetsByTutor(tutorId);
    // Limpar pet selecionado quando trocar tutor
    this.appointmentForm.patchValue({ petId: '' });
    // Habilitar/desabilitar campo de pet baseado na disponibilidade
    const petControl = this.appointmentForm.get('petId');
    if (this.availablePets.length > 0) {
      petControl?.enable();
    } else {
      petControl?.disable();
    }
  }

  private loadAppointmentData(): void {
    if (!this.appointment) return;

    this.loading = true;

    this.appointmentService.getAppointmentById(this.appointment.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const appointment = response.appointment;
          
          // Carregar tutor e pets primeiro
          if (appointment.clinicTutorId) {
            this.loadPetsByTutor(appointment.clinicTutorId);
          }
          this.loadTutors();

          // Preencher formulário
          const appointmentDate = new Date(appointment.date);
          
          // Habilitar campos antes de preencher (em modo de edição)
          this.appointmentForm.get('time')?.enable();
          this.appointmentForm.get('petId')?.enable();
          
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
          });

          this.loadAvailableSlots();
          this.loading = false;
        },
        error: (error) => {
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
    this.loadTutors();
    
    // Desabilitar campos que dependem de outros
    this.appointmentForm.get('time')?.disable();
    this.appointmentForm.get('petId')?.disable();
    
    // Se há valores iniciais, habilitar campos conforme necessário
    if (this.scheduleId && this.date) {
      setTimeout(() => this.loadAvailableSlots(), 0);
    }
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

