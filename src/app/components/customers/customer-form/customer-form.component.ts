import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TutorService, Tutor } from '../../../services/tutor.service';
import { ToastService } from '../../../shared/services/toast.service';
import {
  ButtonComponent,
  InputComponent,
  SelectComponent,
  CardComponent
} from '../../../shared/components';


@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    CardComponent
  ],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit, OnDestroy {
  customerForm: FormGroup;
  loading = false;
  success = false;
  isEditMode = false;
  customerId: string | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private tutorService: TutorService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.customerForm = this.fb.group({
      cpf: ['', [Validators.required, this.cpfValidator()]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.email]],
      phone: ['', [Validators.required, this.phoneValidator()]],
      birthDate: [''],
      address: [''],
      city: [''],
      state: [''],
      zipCode: ['', [this.cepValidator()]]
    });
  }

  ngOnInit(): void {
    // Verificar se é modo de edição
    this.checkEditMode();
    
    // Adicionar máscaras aos campos
    this.setupMasks();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkEditMode(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['id']) {
          this.isEditMode = true;
          this.customerId = params['id'];
          this.loadCustomerData();
        }
      });
  }

  loadCustomerData(): void {
    if (!this.customerId) return;

    this.loading = true;
    this.customerForm.disable();
    
    this.tutorService.getTutorById(this.customerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const customer = response.data;
          this.populateForm(customer);
          this.loading = false;
          this.customerForm.enable();
        },
        error: (error) => {
          console.error('Erro ao carregar dados do cliente:', error);
          this.toastService.showError('Erro ao carregar dados do cliente.');
          this.loading = false;
          this.customerForm.enable();
        }
      });
  }

  populateForm(customer: Tutor): void {
    this.customerForm.patchValue({
      cpf: customer.cpf,
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone,
      birthDate: customer.birthDate ? this.formatDateForInput(customer.birthDate) : '',
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      zipCode: customer.zipCode || ''
    });
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  setupMasks(): void {
    // Máscara para CPF
    this.customerForm.get('cpf')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (value) {
          const cpf = value.replace(/\D/g, '');
          if (cpf.length <= 11) {
            const formatted = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            if (formatted !== value) {
              this.customerForm.patchValue({ cpf: formatted }, { emitEvent: false });
            }
          }
        }
      });

    // Máscara para telefone
    this.customerForm.get('phone')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (value) {
          const phone = value.replace(/\D/g, '');
          if (phone.length <= 11) {
            let formatted = '';
            if (phone.length === 11) {
              formatted = phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (phone.length === 10) {
              formatted = phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            } else {
              formatted = phone;
            }
            if (formatted !== value) {
              this.customerForm.patchValue({ phone: formatted }, { emitEvent: false });
            }
          }
        }
      });

    // Máscara para CEP
    this.customerForm.get('zipCode')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (value) {
          const cep = value.replace(/\D/g, '');
          if (cep.length <= 8) {
            const formatted = cep.replace(/(\d{5})(\d{3})/, '$1-$2');
            if (formatted !== value) {
              this.customerForm.patchValue({ zipCode: formatted }, { emitEvent: false });
            }
          }
        }
      });
  }

  onSubmit(): void {
    if (this.customerForm.valid && !this.loading) {
      this.loading = true;
      this.success = false;
      this.customerForm.disable();

      const formData = this.customerForm.value;
      
      // Limpar máscaras antes de enviar
      const tutorData: Partial<Tutor> = {
        cpf: formData.cpf.replace(/\D/g, ''),
        name: formData.name.trim(),
        email: formData.email?.trim() || undefined,
        phone: formData.phone.replace(/\D/g, ''),
        birthDate: formData.birthDate || undefined,
        address: formData.address?.trim() || undefined,
        city: formData.city?.trim() || undefined,
        state: formData.state?.trim() || undefined,
        zipCode: formData.zipCode?.replace(/\D/g, '') || undefined
      };

      if (this.isEditMode && this.customerId) {
        // Modo edição
        this.tutorService.updateTutor(this.customerId, tutorData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.loading = false;
              this.success = true;
              this.toastService.showSuccess('Cliente atualizado com sucesso!');
              
              // Redirecionar após 2 segundos
              setTimeout(() => {
                this.router.navigate(['/crm/customers']);
              }, 2000);
            },
            error: (error) => {
              this.loading = false;
              this.customerForm.enable();
              console.error('Erro ao atualizar cliente:', error);
              
              if (error.error?.message) {
                this.toastService.showError(error.error.message);
              } else {
                this.toastService.showError('Erro ao atualizar cliente. Tente novamente.');
              }
            }
          });
      } else {
        // Modo criação
        this.tutorService.createTutor(tutorData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.loading = false;
              this.success = true;
              this.customerForm.reset();
              this.toastService.showSuccess('Cliente cadastrado com sucesso!');
              
              // Redirecionar após 2 segundos
              setTimeout(() => {
                this.router.navigate(['/crm/customers']);
              }, 2000);
            },
            error: (error) => {
              this.loading = false;
              this.customerForm.enable();
              console.error('Erro ao criar cliente:', error);
              
              if (error.error?.message) {
                this.toastService.showError(error.error.message);
              } else {
                this.toastService.showError('Erro ao criar cliente. Tente novamente.');
              }
            }
          });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/crm/customers']);
  }

  markFormGroupTouched(): void {
    Object.keys(this.customerForm.controls).forEach(key => {
      const control = this.customerForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.customerForm.get(fieldName);
    
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo é obrigatório';
      }
      if (field.errors['email']) {
        return 'Email inválido';
      }
      if (field.errors['minlength']) {
        return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['invalidCpf']) {
        return 'CPF deve ter 11 dígitos';
      }
      if (field.errors['invalidPhone']) {
        return 'Telefone deve ter 10 ou 11 dígitos';
      }
      if (field.errors['invalidCep']) {
        return 'CEP deve ter 8 dígitos';
      }
      if (field.errors['pattern']) {
        return 'Formato inválido';
      }
    }
    
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.customerForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.customerForm.get(fieldName);
    return !!(field?.valid && field.touched);
  }

  // Validadores customizados
  private cpfValidator() {
    return (control: any) => {
      if (!control.value) return null;
      
      const cpf = control.value.replace(/\D/g, '');
      if (cpf.length !== 11) {
        return { invalidCpf: true };
      }
      return null;
    };
  }

  private phoneValidator() {
    return (control: any) => {
      if (!control.value) return null;
      
      const phone = control.value.replace(/\D/g, '');
      if (phone.length < 10 || phone.length > 11) {
        return { invalidPhone: true };
      }
      return null;
    };
  }

  private cepValidator() {
    return (control: any) => {
      if (!control.value) return null;
      
      const cep = control.value.replace(/\D/g, '');
      if (cep.length !== 8) {
        return { invalidCep: true };
      }
      return null;
    };
  }

  getStates(): string[] {
    return [
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
      'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
      'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];
  }

  getStateOptions() {
    return this.getStates().map(state => ({
      value: state,
      label: state
    }));
  }
}
