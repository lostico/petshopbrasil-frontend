import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PetService, Pet, PetSpecies, PetGender, CreatePetRequest, UpdatePetRequest } from '../../../services/pet.service';
import { TutorService, Tutor } from '../../../services/tutor.service';
import { ToastService } from '../../../shared/services/toast.service';
import {
  ButtonComponent,
  InputComponent,
  SelectComponent,
  CardComponent,
  PageContainerComponent,
  PageHeaderComponent
} from '../../../shared/components';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    ButtonComponent,
    InputComponent,
    SelectComponent,
    CardComponent,
    PageContainerComponent,
    PageHeaderComponent
  ],
  templateUrl: './pet-form.component.html'
})
export class PetFormComponent implements OnInit, OnDestroy {
  petForm!: FormGroup;
  loading = false;
  isEditMode = false;
  petId: string = '';
  selectedTutorId: string = '';
  selectedTutor: Tutor | null = null;
  petTutor: any = null; // Tutor do pet em modo de edição
  
  // Enums para o template
  PetSpecies = PetSpecies;
  PetGender = PetGender;
  
  // Opções para os selects
  speciesOptions = [
    { value: PetSpecies.DOG, label: 'Cão' },
    { value: PetSpecies.CAT, label: 'Gato' },
    { value: PetSpecies.BIRD, label: 'Ave' },
    { value: PetSpecies.FISH, label: 'Peixe' },
    { value: PetSpecies.RABBIT, label: 'Coelho' },
    { value: PetSpecies.HAMSTER, label: 'Hamster' },
    { value: PetSpecies.OTHER, label: 'Outro' }
  ];

  genderOptions = [
    { value: PetGender.MALE, label: 'Macho' },
    { value: PetGender.FEMALE, label: 'Fêmea' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private petService: PetService,
    private tutorService: TutorService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Verificar se é modo de edição
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.petId = params['id'];
        this.loadPet();
        // Em modo de edição, remover validação do tutorId
        this.petForm.get('tutorId')?.clearValidators();
        this.petForm.get('tutorId')?.updateValueAndValidity();
      } else {
        // Modo de criação - sempre deve ter um tutor
        this.isEditMode = false;
        
        // Verificar se há idTutor no path (obrigatório)
        if (params['idTutor'] && params['idTutor'].trim() !== '') {
          this.selectedTutorId = params['idTutor'].trim();
          this.petForm.patchValue({ tutorId: this.selectedTutorId });
          this.loadTutorInfo();
          // Remover validação do tutorId pois já está pré-selecionado
          this.petForm.get('tutorId')?.clearValidators();
          this.petForm.get('tutorId')?.updateValueAndValidity();
        } else {
          // Se não há tutor, redirecionar para lista de pets
          this.toastService.showError('Tutor não informado. Não é possível cadastrar um pet sem um cliente válido.');
          setTimeout(() => {
            this.router.navigate(['/crm/pets']);
          }, 3000);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.petForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      species: ['', Validators.required],
      breed: [''],
      gender: [''],
      birthDate: [''],
      weight: ['', [Validators.min(0)]],
      color: [''],
      microchip: [''],
      tutorId: [''] // Sem validação, será tratado conforme o modo
    });
  }

  private loadPet(): void {
    this.loading = true;
    this.petService.getPetById(this.petId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pet: Pet) => {
          const birthDateFormatted = pet.birthDate ? 
            (typeof pet.birthDate === 'string' ? 
              new Date(pet.birthDate).toISOString().split('T')[0] : 
              pet.birthDate.toISOString().split('T')[0]) : '';
          
          this.petForm.patchValue({
            name: pet.name,
            species: pet.species,
            breed: pet.breed || '',
            gender: pet.gender || '',
            birthDate: birthDateFormatted,
            weight: pet.weight ? pet.weight.toString() : '',
            color: pet.color || '',
            microchip: pet.microchip || '',
            tutorId: '' // Não preencher em modo de edição
          });
          
          // Em modo de edição, carregar informações do tutor
          if (this.isEditMode && pet.tutor) {
            this.petTutor = pet.tutor;
          }
          
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Erro ao carregar pet:', error);
          
          if (error.status === 404) {
            this.toastService.showError('Pet não encontrado');
          } else {
            this.toastService.showError('Erro ao carregar dados do pet.');
          }
          
          this.loading = false;
        }
      });
  }



  private loadTutorInfo(): void {
    if (this.selectedTutorId && this.selectedTutorId.trim() !== '') {
      this.tutorService.getTutorById(this.selectedTutorId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: any) => {
            this.selectedTutor = response.data;
          },
          error: (error: any) => {
            console.error('Erro ao carregar informações do tutor:', error);
            
            if (error.status === 404) {
              this.toastService.showError('Cliente não encontrado. Não é possível cadastrar um pet sem um cliente válido.');
            } else {
              this.toastService.showError('Erro ao carregar informações do cliente. Tente novamente.');
            }
            
            // Limpar o tutorId inválido do formulário
            this.petForm.patchValue({ tutorId: '' });
            this.selectedTutorId = '';
            
            // Redirecionar após 3 segundos
            setTimeout(() => {
              this.router.navigate(['/crm/pets']);
            }, 3000);
          }
        });
    }
  }

  onSubmit(): void {
    if (this.petForm.valid) {
      this.loading = true;

      const formData = this.petForm.value;
      
      // Validação adicional para tutorId apenas em modo de criação
      if (!this.isEditMode) {
        if (!formData.tutorId || formData.tutorId.trim() === '') {
          this.toastService.showError('Selecione um tutor válido');
          this.loading = false;
          return;
        }

        // Validar se o tutorId tem pelo menos 10 caracteres (CUID mínimo)
        if (formData.tutorId.trim().length < 10) {
          this.toastService.showError('ID do tutor inválido');
          this.loading = false;
          return;
        }
      }


      
      // Converter data de nascimento
      if (formData.birthDate) {
        formData.birthDate = new Date(formData.birthDate);
      }

      // Converter peso para número
      if (formData.weight && formData.weight.toString().trim() !== '') {
        const weightValue = parseFloat(formData.weight.toString());
        if (!isNaN(weightValue) && weightValue >= 0) {
          formData.weight = weightValue;
        } else {
          formData.weight = null;
        }
      } else {
        formData.weight = null;
      }

      if (this.isEditMode) {
        const updateData: UpdatePetRequest = {
          name: formData.name,
          species: formData.species,
          breed: formData.breed && formData.breed.trim() !== '' ? formData.breed : null,
          gender: formData.gender && formData.gender.trim() !== '' ? formData.gender : null,
          birthDate: formData.birthDate || null,
          weight: formData.weight || null,
          color: formData.color && formData.color.trim() !== '' ? formData.color : null,
          microchip: formData.microchip && formData.microchip.trim() !== '' ? formData.microchip : null
        };



        this.petService.updatePet(this.petId, updateData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.toastService.showSuccess('Pet atualizado com sucesso!');
              this.router.navigate(['/crm/pets']);
            },
            error: (error: any) => {
              console.error('Erro ao atualizar pet:', error);
              
              if (error.status === 400) {
                this.toastService.showError(error.error?.message || 'Dados inválidos fornecidos');
              } else if (error.status === 404) {
                this.toastService.showError('Pet não encontrado');
              } else {
                this.toastService.showError('Erro ao atualizar pet. Tente novamente.');
              }
              
              this.loading = false;
            }
          });
      } else {
        const createData: CreatePetRequest = {
          name: formData.name,
          species: formData.species,
          breed: formData.breed && formData.breed.trim() !== '' ? formData.breed : undefined,
          gender: formData.gender && formData.gender.trim() !== '' ? formData.gender : undefined,
          birthDate: formData.birthDate || undefined,
          weight: formData.weight || undefined,
          color: formData.color && formData.color.trim() !== '' ? formData.color : undefined,
          microchip: formData.microchip && formData.microchip.trim() !== '' ? formData.microchip : undefined,
          tutorId: formData.tutorId.trim()
        };

        this.petService.createPet(createData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.toastService.showSuccess('Pet cadastrado com sucesso!');
              // Se veio de um tutor específico, voltar para a lista de pets desse tutor
              if (this.selectedTutorId) {
                this.router.navigate(['/crm/pets'], { 
                  queryParams: { tutorId: this.selectedTutorId } 
                });
              } else {
                this.router.navigate(['/crm/pets']);
              }
            },
            error: (error: any) => {
              console.error('Erro ao criar pet:', error);
              
              if (error.status === 400) {
                this.toastService.showError(error.error?.message || 'Dados inválidos fornecidos');
              } else if (error.status === 404) {
                this.toastService.showError('Tutor não encontrado');
              } else {
                this.toastService.showError('Erro ao criar pet. Tente novamente.');
              }
              
              this.loading = false;
            }
          });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    if (this.selectedTutorId) {
      this.router.navigate(['/crm/pets'], { 
        queryParams: { tutorId: this.selectedTutorId } 
      });
    } else {
      this.router.navigate(['/crm/pets']);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.petForm.controls).forEach(key => {
      const control = this.petForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.petForm.get(fieldName);
    
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo é obrigatório';
      }
      if (field.errors['minlength']) {
        return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['min']) {
        return 'Valor deve ser maior que zero';
      }
      if (field.errors['pattern']) {
        return 'Formato inválido';
      }
    }
    
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.petForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.petForm.get(fieldName);
    return !!(field?.valid && field.touched);
  }

  getSpeciesLabel(species: PetSpecies): string {
    const option = this.speciesOptions.find(opt => opt.value === species);
    return option ? option.label : species;
  }

  getGenderLabel(gender: PetGender): string {
    const option = this.genderOptions.find(opt => opt.value === gender);
    return option ? option.label : gender;
  }



  formatCPF(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  }
}
