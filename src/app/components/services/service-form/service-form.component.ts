import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ServiceService, Service, ServiceCategory, CreateServiceRequest, UpdateServiceRequest } from '../../../services/service.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { TextareaComponent } from '../../../shared/components/textarea/textarea.component';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { PageContainerComponent } from '../../../shared/components/page-container/page-container.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    TextareaComponent,
    SelectComponent,
    CardComponent,
    PageContainerComponent,
    PageHeaderComponent
  ],
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.css']
})
export class ServiceFormComponent implements OnInit, OnDestroy {
  serviceForm!: FormGroup;
  loading = false;
  submitting = false;
  isEditMode = false;
  serviceId: string | null = null;
  service: Service | null = null;

  private destroy$ = new Subject<void>();

  // Opções de categoria
  categories = [
    { value: ServiceCategory.CONSULTATION, label: 'Consulta' },
    { value: ServiceCategory.VACCINATION, label: 'Vacinação' },
    { value: ServiceCategory.GROOMING, label: 'Banho e Tosa' },
    { value: ServiceCategory.SURGERY, label: 'Cirurgia' },
    { value: ServiceCategory.DENTAL, label: 'Dental' },
    { value: ServiceCategory.EMERGENCY, label: 'Emergência' },
    { value: ServiceCategory.OTHER, label: 'Outros' }
  ];

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      price: ['', [Validators.required, Validators.min(0), Validators.max(999999.99)]],
      duration: ['', [Validators.required, Validators.min(1), Validators.max(480)]], // Máximo 8 horas
      category: ['', [Validators.required]],
      isActive: [true]
    });
  }

  private checkEditMode(): void {
    this.serviceId = this.route.snapshot.paramMap.get('id');
    
    if (this.serviceId) {
      this.isEditMode = true;
      this.loadService();
    }
  }

  private loadService(): void {
    if (!this.serviceId) return;

    this.loading = true;

    this.serviceService.getServiceById(this.serviceId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.service = response.service;
          this.populateForm();
          this.loading = false;
        },
        error: (error) => {
          this.toastService.showError('Erro ao carregar serviço. Tente novamente.');
          this.loading = false;
          console.error('Erro ao carregar serviço:', error);
        }
      });
  }

  private populateForm(): void {
    if (!this.service) return;

    this.serviceForm.patchValue({
      name: this.service.name,
      description: this.service.description || '',
      price: this.service.price,
      duration: this.service.duration,
      category: this.service.category,
      isActive: this.service.isActive
    });
  }

  onSubmit(): void {
    if (this.serviceForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.submitting = true;

    const formValue = this.serviceForm.value;

    if (this.isEditMode && this.serviceId) {
      this.updateService(formValue);
    } else {
      this.createService(formValue);
    }
  }

  private createService(serviceData: CreateServiceRequest): void {
    this.serviceService.createService(serviceData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.toastService.showSuccess('Serviço criado com sucesso!');
          this.submitting = false;
          
          // Redirecionar após 2 segundos
          setTimeout(() => {
            this.router.navigate(['/services']);
          }, 2000);
        },
        error: (error) => {
          this.handleError(error, 'Erro ao criar serviço.');
        }
      });
  }

  private updateService(serviceData: UpdateServiceRequest): void {
    if (!this.serviceId) return;

    this.serviceService.updateService(this.serviceId, serviceData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.toastService.showSuccess('Serviço atualizado com sucesso!');
          this.submitting = false;
          
          // Redirecionar após 2 segundos
          setTimeout(() => {
            this.router.navigate(['/services']);
          }, 2000);
        },
        error: (error) => {
          this.handleError(error, 'Erro ao atualizar serviço.');
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

  onCancel(): void {
    this.router.navigate(['/services']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.serviceForm.controls).forEach(key => {
      const control = this.serviceForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para validação
  get name() {
    return this.serviceForm.get('name');
  }

  get description() {
    return this.serviceForm.get('description');
  }

  get price() {
    return this.serviceForm.get('price');
  }

  get duration() {
    return this.serviceForm.get('duration');
  }

  get category() {
    return this.serviceForm.get('category');
  }

  get isActive() {
    return this.serviceForm.get('isActive');
  }

  // Métodos auxiliares
  formatPrice(price: number): string {
    return this.serviceService.formatPrice(price);
  }

  formatDuration(duration: number): string {
    return this.serviceService.formatDuration(duration);
  }

  getCategoryName(category: ServiceCategory): string {
    return this.serviceService.getCategoryName(category);
  }

  // Validação de preço
  onPriceChange(event: any): void {
    const value = event.target.value;
    if (value && parseFloat(value) < 0) {
      this.serviceForm.patchValue({ price: 0 });
    }
  }

  // Validação de duração
  onDurationChange(event: any): void {
    const value = event.target.value;
    if (value && parseInt(value) < 1) {
      this.serviceForm.patchValue({ duration: 1 });
    }
  }
}


