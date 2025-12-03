import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { VaccineService, Vaccine, VaccineType, Species, CreateVaccineRequest, UpdateVaccineRequest } from '../../../services/vaccine.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { TextareaComponent } from '../../../shared/components/textarea/textarea.component';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { PageContainerComponent } from '../../../shared/components/page-container/page-container.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-vaccine-form',
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
  templateUrl: './vaccine-form.component.html',
  styleUrls: ['./vaccine-form.component.css']
})
export class VaccineFormComponent implements OnInit, OnDestroy {
  vaccineForm!: FormGroup;
  loading = false;
  submitting = false;
  isEditMode = false;
  vaccineId: string | null = null;
  vaccine: Vaccine | null = null;

  private destroy$ = new Subject<void>();

  // Opções de tipo
  typeOptions = [
    { value: VaccineType.CORE, label: 'Essencial' },
    { value: VaccineType.NON_CORE, label: 'Não Essencial' },
    { value: VaccineType.ANNUAL, label: 'Anual' },
    { value: VaccineType.BOOSTER, label: 'Reforço' }
  ];

  // Opções de espécies
  speciesOptions = [
    { value: Species.DOG, label: 'Cão' },
    { value: Species.CAT, label: 'Gato' },
    { value: Species.BIRD, label: 'Ave' },
    { value: Species.FISH, label: 'Peixe' },
    { value: Species.RABBIT, label: 'Coelho' },
    { value: Species.HAMSTER, label: 'Hamster' },
    { value: Species.OTHER, label: 'Outro' }
  ];

  constructor(
    private fb: FormBuilder,
    private vaccineService: VaccineService,
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
    this.vaccineForm = this.fb.group({
      name: ['', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(100),
        this.noWhitespaceValidator
      ]],
      description: ['', [Validators.maxLength(500)]],
      type: ['', [Validators.required]],
      species: [[], [Validators.required, this.atLeastOneSpeciesValidator]],
      manufacturer: ['', [Validators.maxLength(100)]],
      isActive: [true]
    });
  }

  private noWhitespaceValidator = (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value && typeof control.value === 'string') {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    }
    return null;
  }

  private atLeastOneSpeciesValidator = (control: AbstractControl): { [key: string]: any } | null => {
    const speciesArray = control.value as Species[];
    if (!speciesArray || speciesArray.length === 0) {
      return { required: true };
    }
    return null;
  }

  private checkEditMode(): void {
    this.vaccineId = this.route.snapshot.paramMap.get('id');
    
    if (this.vaccineId) {
      this.isEditMode = true;
      this.loadVaccine();
    }
  }

  private loadVaccine(): void {
    if (!this.vaccineId) return;

    this.loading = true;

    this.vaccineService.getVaccineById(this.vaccineId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.vaccine = response.vaccine;
          this.populateForm(response.vaccine);
          this.loading = false;
        },
        error: (error) => {
          this.toastService.showError('Erro ao carregar vacina. Tente novamente.');
          this.loading = false;
          console.error('Erro ao carregar vacina:', error);
          this.router.navigate(['/vaccines']);
        }
      });
  }

  private populateForm(vaccine: Vaccine): void {
    // Definir espécies selecionadas primeiro
    this.selectedSpecies = [...vaccine.species];
    
    // Popular o formulário
    this.vaccineForm.patchValue({
      name: vaccine.name,
      description: vaccine.description || '',
      type: String(vaccine.type),
      manufacturer: vaccine.manufacturer || '',
      isActive: vaccine.isActive
    });
    
    // Garantir que o tipo seja setado corretamente como string
    // Isso resolve o problema do select não reconhecer o valor
    const typeValue = String(vaccine.type);
    this.type?.setValue(typeValue, { emitEvent: false });
    
    // Atualizar o FormControl de espécies após popular o form
    this.updateSpeciesFormControl();
  }

  // Getters para facilitar acesso aos controles
  get name() { return this.vaccineForm.get('name'); }
  get description() { return this.vaccineForm.get('description'); }
  get type() { return this.vaccineForm.get('type'); }
  get species() { return this.vaccineForm.get('species'); }
  get manufacturer() { return this.vaccineForm.get('manufacturer'); }
  get isActive() { return this.vaccineForm.get('isActive'); }

  // Gerenciamento de espécies selecionadas
  selectedSpecies: Species[] = [];

  toggleSpecies(species: Species): void {
    const index = this.selectedSpecies.indexOf(species);
    if (index > -1) {
      this.selectedSpecies.splice(index, 1);
    } else {
      this.selectedSpecies.push(species);
    }
    this.updateSpeciesFormControl();
  }

  isSpeciesSelected(species: Species): boolean {
    return this.selectedSpecies.includes(species);
  }

  private updateSpeciesFormControl(): void {
    this.species?.setValue(this.selectedSpecies);
    this.species?.markAsTouched();
  }

  onSubmit(): void {
    if (this.vaccineForm.invalid || this.selectedSpecies.length === 0) {
      this.vaccineForm.markAllAsTouched();
      if (this.selectedSpecies.length === 0) {
        this.species?.setErrors({ required: true });
      }
      return;
    }

    this.submitting = true;

    const formValue = this.vaccineForm.value;
    
    if (this.isEditMode && this.vaccineId) {
      // Modo edição: atualização parcial - enviar apenas campos alterados
      const updateData = this.prepareUpdateData(formValue);
      
      // Verificar se há alterações
      if (Object.keys(updateData).length === 0) {
        this.toastService.showError('Nenhuma alteração foi feita.');
        this.submitting = false;
        return;
      }
      
      this.updateVaccine(updateData);
    } else {
      // Modo criação: enviar todos os campos obrigatórios
      const vaccineData: CreateVaccineRequest = {
        name: formValue.name?.trim() || '',
        type: formValue.type,
        species: this.selectedSpecies,
        description: formValue.description?.trim() || null,
        manufacturer: formValue.manufacturer?.trim() || null,
        isActive: formValue.isActive !== false
      };
      this.createVaccine(vaccineData);
    }
  }

  private prepareUpdateData(formValue: any): UpdateVaccineRequest {
    const updateData: UpdateVaccineRequest = {};

    if (!this.vaccine) {
      return updateData;
    }

    // Comparar e incluir apenas campos alterados
    const trimmedName = formValue.name?.trim() || '';
    if (trimmedName && trimmedName !== this.vaccine.name) {
      updateData.name = trimmedName;
    }

    const trimmedDescription = formValue.description?.trim() || null;
    // Comparar considerando null e string vazia como equivalentes
    const originalDescription = this.vaccine.description || null;
    if (trimmedDescription !== originalDescription) {
      updateData.description = trimmedDescription;
    }

    if (formValue.type && formValue.type !== this.vaccine.type) {
      updateData.type = formValue.type;
    }

    // Comparar arrays de espécies (ordem não importa)
    const currentSpecies = [...this.selectedSpecies].sort();
    const originalSpecies = [...this.vaccine.species].sort();
    const speciesChanged = currentSpecies.length !== originalSpecies.length ||
      currentSpecies.some((species, index) => species !== originalSpecies[index]);
    
    if (speciesChanged) {
      updateData.species = this.selectedSpecies;
    }

    const trimmedManufacturer = formValue.manufacturer?.trim() || null;
    // Comparar considerando null e string vazia como equivalentes
    const originalManufacturer = this.vaccine.manufacturer || null;
    if (trimmedManufacturer !== originalManufacturer) {
      updateData.manufacturer = trimmedManufacturer;
    }

    if (formValue.isActive !== undefined && formValue.isActive !== this.vaccine.isActive) {
      updateData.isActive = formValue.isActive !== false;
    }

    return updateData;
  }

  private createVaccine(data: CreateVaccineRequest): void {
    this.vaccineService.createVaccine(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.toastService.showSuccess('Vacina cadastrada com sucesso!');
          this.router.navigate(['/vaccines']);
        },
        error: (error) => {
          this.submitting = false;
          this.handleError(error);
        }
      });
  }

  private updateVaccine(data: UpdateVaccineRequest): void {
    if (!this.vaccineId) return;

    this.vaccineService.updateVaccine(this.vaccineId, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.toastService.showSuccess('Vacina atualizada com sucesso!');
          this.router.navigate(['/vaccines']);
        },
        error: (error) => {
          this.submitting = false;
          this.handleError(error);
        }
      });
  }

  private handleError(error: any): void {
    let errorMessage = 'Erro ao processar a solicitação. Tente novamente.';
    
    if (error?.error?.message) {
      errorMessage = error.error.message;
    } else if (error?.status === 400) {
      // Mensagens específicas para diferentes tipos de erro 400
      if (error?.error?.message?.includes('vazio')) {
        errorMessage = 'Nome da vacina não pode estar vazio.';
      } else if (error?.error?.message?.includes('Tipo')) {
        errorMessage = 'Tipo de vacina inválido.';
      } else if (error?.error?.message?.includes('Espécies')) {
        errorMessage = 'Espécies compatíveis são obrigatórias.';
      } else {
        errorMessage = 'Dados inválidos. Verifique os campos do formulário.';
      }
    } else if (error?.status === 404) {
      errorMessage = 'Vacina não encontrada.';
    } else if (error?.status === 409) {
      errorMessage = 'Já existe uma vacina com este nome.';
    } else if (error?.status === 401) {
      errorMessage = 'Sessão expirada. Faça login novamente.';
    } else if (error?.status === 403) {
      errorMessage = 'Você não tem permissão para realizar esta ação.';
    } else if (error?.status === 500) {
      errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
    }
    
    this.toastService.showError(errorMessage);
    console.error('Erro:', error);
  }

  onCancel(): void {
    this.router.navigate(['/vaccines']);
  }

  // Propriedades para uso no template
  VaccineType = VaccineType;
  Species = Species;
}

