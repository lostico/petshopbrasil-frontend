import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, AfterViewInit, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ScheduleService, Schedule, CreateScheduleRequest, UpdateScheduleRequest } from '../../../services/schedule.service';
import { ServiceService, Service } from '../../../services/service.service';
import { ToastService } from '../../../shared/services/toast.service';
import { InputComponent } from '../../../shared/components/input/input.component';
import { TextareaComponent } from '../../../shared/components/textarea/textarea.component';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { ModalComponent, ModalConfig, ModalAction } from '../../../shared/components/modal/modal.component';
import { CardComponent } from '../../../shared/components/card/card.component';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo', short: 'Dom' },
  { value: 1, label: 'Segunda-feira', short: 'Seg' },
  { value: 2, label: 'Terça-feira', short: 'Ter' },
  { value: 3, label: 'Quarta-feira', short: 'Qua' },
  { value: 4, label: 'Quinta-feira', short: 'Qui' },
  { value: 5, label: 'Sexta-feira', short: 'Sex' },
  { value: 6, label: 'Sábado', short: 'Sáb' }
];

const SCHEDULE_CATEGORIES = [
  { value: 'CONSULTA', label: 'Consulta' },
  { value: 'CIRURGIA', label: 'Cirurgia' },
  { value: 'VACINACAO', label: 'Vacinação' },
  { value: 'EXAME', label: 'Exame' },
  { value: 'BANHO', label: 'Banho' },
  { value: 'TOSA', label: 'Tosa' },
  { value: 'BANHO_E_TOSA', label: 'Banho e Tosa' },
  { value: 'HOTEL', label: 'Hotel' },
  { value: 'HOSPEDAGEM', label: 'Hospedagem' }
];

const SCHEDULE_TYPES = [
  { value: 'ORDEM_CHEGADA', label: 'Ordem de Chegada' },
  { value: 'HORARIO_MARCADO', label: 'Horário Marcado' }
];

const TIME_INTERVALS = [
  { value: 15, label: '15 minutos' },
  { value: 30, label: '30 minutos' },
  { value: 60, label: '1 hora' }
];

const COLORS = [
  { value: '#3B82F6', label: 'Azul' },
  { value: '#10B981', label: 'Verde' },
  { value: '#F59E0B', label: 'Amarelo' },
  { value: '#EF4444', label: 'Vermelho' },
  { value: '#8B5CF6', label: 'Roxo' },
  { value: '#EC4899', label: 'Rosa' },
  { value: '#06B6D4', label: 'Ciano' },
  { value: '#F97316', label: 'Laranja' }
];

@Component({
  selector: 'app-schedule-form',
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
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.css']
})
export class ScheduleFormComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() schedule: Schedule | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Schedule>();

  scheduleForm!: FormGroup;
  loading = false;
  submitting = false;
  isEditMode = false;
  availableServices: Service[] = [];

  modalConfig: ModalConfig = {
    title: 'Nova Agenda',
    size: 'xl',
    showCloseButton: true,
    closeOnOverlayClick: false,
    showFooter: true,
    footerActions: []
  };

  // Opções para os selects
  scheduleTypes = SCHEDULE_TYPES;
  categories = SCHEDULE_CATEGORIES;
  timeIntervals = TIME_INTERVALS;
  colors = COLORS;
  daysOfWeek = DAYS_OF_WEEK;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private serviceService: ServiceService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadServices();
    this.updateModalConfig();
  }
  
  ngAfterViewInit(): void {
    // Observar mudanças no formulário para atualizar o botão dinamicamente
    if (this.scheduleForm) {
      this.scheduleForm.statusChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.updateModalConfig();
        });
      
      this.scheduleForm.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.updateModalConfig();
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['schedule'] || changes['isOpen']) {
      if (this.isOpen) {
        if (this.schedule) {
          this.isEditMode = true;
          this.modalConfig.title = 'Editar Agenda';
          this.loadScheduleData();
        } else {
          this.isEditMode = false;
          this.modalConfig.title = 'Nova Agenda';
          this.resetForm();
        }
        this.updateModalConfig();
      }
    }
  }

  private initForm(): void {
    this.scheduleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      scheduleType: ['HORARIO_MARCADO', [Validators.required]],
      category: ['', [Validators.required]],
      color: ['#3B82F6', [Validators.required]],
      timeInterval: [30, [Validators.required, Validators.min(15)]],
      isActive: [true],
      allowAppBooking: [false],
      validFrom: ['', [Validators.required]],
      validUntil: [''],
      vetId: [''],
      scheduleDays: this.fb.array([], [this.atLeastOneDayActiveValidator]),
      serviceIds: this.fb.array([])
    });

    // Inicializar dias da semana
    this.initScheduleDays();
  }

  // Validador customizado para garantir que pelo menos um dia esteja ativo
  private atLeastOneDayActiveValidator = (control: AbstractControl): ValidationErrors | null => {
    const scheduleDays = control as FormArray;
    if (!scheduleDays || scheduleDays.length === 0) {
      return { atLeastOneDayRequired: true };
    }
    
    const hasActiveDay = scheduleDays.controls.some(dayControl => {
      const dayGroup = dayControl as FormGroup;
      return dayGroup.get('isActive')?.value === true;
    });
    
    return hasActiveDay ? null : { atLeastOneDayRequired: true };
  }

  private initScheduleDays(): void {
    const daysArray = this.scheduleForm.get('scheduleDays') as FormArray;
    daysArray.clear();

    DAYS_OF_WEEK.forEach(day => {
      daysArray.push(this.fb.group({
        dayOfWeek: [day.value],
        isActive: [false],
        startTime: ['08:00'],
        endTime: ['18:00'],
        breakStart: [''],
        breakEnd: [''],
        maxAppointments: [null]
      }));
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

  private loadScheduleData(): void {
    if (!this.schedule) return;

    this.loading = true;

    this.scheduleService.getScheduleById(this.schedule.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const schedule = response.schedule;
          
          // Preencher formulário básico
          this.scheduleForm.patchValue({
            name: schedule.name,
            description: schedule.description || '',
            scheduleType: schedule.scheduleType,
            category: schedule.category,
            color: schedule.color,
            timeInterval: schedule.timeInterval,
            isActive: schedule.isActive,
            allowAppBooking: schedule.allowAppBooking,
            validFrom: schedule.validFrom ? schedule.validFrom.split('T')[0] : '',
            validUntil: schedule.validUntil ? schedule.validUntil.split('T')[0] : '',
            vetId: schedule.vetId || ''
          });

          // Preencher dias da semana
          const daysArray = this.scheduleForm.get('scheduleDays') as FormArray;
          daysArray.clear();
          
          DAYS_OF_WEEK.forEach(day => {
            const scheduleDay = schedule.scheduleDays?.find(sd => sd.dayOfWeek === day.value);
            daysArray.push(this.fb.group({
              dayOfWeek: [day.value],
              isActive: [scheduleDay?.isActive || false],
              startTime: [scheduleDay?.startTime || '08:00'],
              endTime: [scheduleDay?.endTime || '18:00'],
              breakStart: [scheduleDay?.breakStart || ''],
              breakEnd: [scheduleDay?.breakEnd || ''],
              maxAppointments: [scheduleDay?.maxAppointments || null]
            }));
          });

          // Preencher serviços
          const serviceIdsArray = this.scheduleForm.get('serviceIds') as FormArray;
          serviceIdsArray.clear();
          if (schedule.scheduleServices) {
            schedule.scheduleServices.forEach(ss => {
              if (ss.isActive) {
                serviceIdsArray.push(this.fb.control(ss.serviceId));
              }
            });
          }

          this.loading = false;
        },
        error: (error) => {
          this.toastService.showError('Erro ao carregar agenda. Tente novamente.');
          this.loading = false;
          console.error('Erro ao carregar agenda:', error);
        }
      });
  }

  private resetForm(): void {
    this.scheduleForm.reset({
      name: '',
      description: '',
      scheduleType: 'HORARIO_MARCADO',
      category: '',
      color: '#3B82F6',
      timeInterval: 30,
      isActive: true,
      allowAppBooking: false,
      validFrom: '',
      validUntil: '',
      vetId: '',
      scheduleDays: [],
      serviceIds: []
    });
    this.initScheduleDays();
  }

  get isFormValid(): boolean {
    return this.scheduleForm?.valid ?? false;
  }

  private updateModalConfig(): void {
    // Recriar o objeto completamente para garantir detecção de mudanças
    const isValid = this.scheduleForm?.valid ?? false;
    this.modalConfig = {
      ...this.modalConfig,
      footerActions: [
        {
          label: 'Cancelar',
          variant: 'secondary',
          onClick: () => this.onClose()
        },
        {
          label: this.isEditMode ? 'Atualizar' : 'Criar',
          variant: 'primary',
          disabled: !isValid || this.submitting,
          loading: this.submitting,
          onClick: () => this.onSubmit()
        }
      ]
    };
    // Forçar detecção de mudanças
    this.cdr.detectChanges();
  }

  get scheduleDaysArray(): FormArray {
    return this.scheduleForm.get('scheduleDays') as FormArray;
  }

  get serviceIdsArray(): FormArray {
    return this.scheduleForm.get('serviceIds') as FormArray;
  }

  getDayControl(index: number): FormGroup | null {
    if (!this.scheduleDaysArray || index < 0 || index >= this.scheduleDaysArray.length) {
      return null;
    }
    return this.scheduleDaysArray.at(index) as FormGroup;
  }

  getDayFormControl(index: number, controlName: string): FormControl {
    // Verificar se o FormArray está inicializado e tem o índice válido
    if (!this.scheduleDaysArray || index < 0 || index >= this.scheduleDaysArray.length) {
      // Retornar um FormControl vazio temporário para evitar erros durante a inicialização
      return this.fb.control('');
    }
    
    const dayControl = this.scheduleDaysArray.at(index) as FormGroup;
    if (!dayControl) {
      return this.fb.control('');
    }
    
    const control = dayControl.get(controlName);
    return control ? (control as FormControl) : this.fb.control('');
  }

  toggleDay(index: number): void {
    const dayControl = this.getDayControl(index);
    if (!dayControl) {
      return;
    }
    const isActive = dayControl.get('isActive')?.value;
    dayControl.patchValue({ isActive: !isActive });
    // Atualizar validação do FormArray após mudança
    this.scheduleDaysArray.updateValueAndValidity();
    // Atualizar modal config para refletir mudança no estado do formulário
    this.updateModalConfig();
  }

  toggleService(serviceId: string): void {
    const serviceIdsArray = this.serviceIdsArray;
    const index = serviceIdsArray.value.indexOf(serviceId);
    
    if (index > -1) {
      serviceIdsArray.removeAt(index);
    } else {
      serviceIdsArray.push(this.fb.control(serviceId));
    }
  }

  isServiceSelected(serviceId: string): boolean {
    return this.serviceIdsArray.value.includes(serviceId);
  }

  onSubmit(): void {
    if (this.scheduleForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.submitting = true;
    const formValue = this.scheduleForm.value;

    // Preparar dados
    const scheduleData: CreateScheduleRequest | UpdateScheduleRequest = {
      name: formValue.name,
      description: formValue.description || null,
      scheduleType: formValue.scheduleType,
      category: formValue.category,
      color: formValue.color,
      timeInterval: formValue.timeInterval,
      isActive: formValue.isActive ?? true,
      allowAppBooking: formValue.allowAppBooking ?? false,
      validFrom: `${formValue.validFrom}T00:00:00.000Z`,
      validUntil: formValue.validUntil ? `${formValue.validUntil}T23:59:59.999Z` : null,
      vetId: formValue.vetId || null,
      scheduleDays: formValue.scheduleDays.map((day: any) => ({
        dayOfWeek: day.dayOfWeek,
        isActive: day.isActive,
        startTime: day.startTime,
        endTime: day.endTime,
        breakStart: day.breakStart || null,
        breakEnd: day.breakEnd || null,
        maxAppointments: day.maxAppointments || null
      })),
      serviceIds: formValue.serviceIds || []
    };

    if (this.isEditMode && this.schedule) {
      this.updateSchedule(scheduleData as UpdateScheduleRequest);
    } else {
      this.createSchedule(scheduleData as CreateScheduleRequest);
    }
  }

  private createSchedule(scheduleData: CreateScheduleRequest): void {
    this.scheduleService.createSchedule(scheduleData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.toastService.showSuccess('Agenda criada com sucesso!');
          this.submitting = false;
          this.saved.emit(response.schedule);
          this.onClose();
        },
        error: (error) => {
          this.handleError(error, 'Erro ao criar agenda.');
        }
      });
  }

  private updateSchedule(scheduleData: UpdateScheduleRequest): void {
    if (!this.schedule) return;

    this.scheduleService.updateSchedule(this.schedule.id, scheduleData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.toastService.showSuccess('Agenda atualizada com sucesso!');
          this.submitting = false;
          this.saved.emit(response.schedule);
          this.onClose();
        },
        error: (error) => {
          this.handleError(error, 'Erro ao atualizar agenda.');
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
    Object.keys(this.scheduleForm.controls).forEach(key => {
      const control = this.scheduleForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para validação
  get name() {
    return this.scheduleForm.get('name');
  }

  get description() {
    return this.scheduleForm.get('description');
  }

  get scheduleType() {
    return this.scheduleForm.get('scheduleType');
  }

  get category() {
    return this.scheduleForm.get('category');
  }

  get color() {
    return this.scheduleForm.get('color');
  }

  get timeInterval() {
    return this.scheduleForm.get('timeInterval');
  }

  get validFrom() {
    return this.scheduleForm.get('validFrom');
  }
}

