import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { PetService, Pet, PetSearchParams, PetSpecies, PetGender, PetStatus } from '../../services/pet.service';
import { ToastService } from '../../shared/services/toast.service';
import { PetDetailModalComponent } from './pet-detail-modal.component';
import { PetStatusModalComponent } from './pet-status-modal.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { SelectComponent, SelectOption } from '../../shared/components/select/select.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { PhoneFormatPipe } from '../../shared/pipes/phone-format.pipe';
import { PaginationComponent, PaginationConfig, PaginationChange } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    PetDetailModalComponent, 
    PetStatusModalComponent,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    CardComponent,
    PhoneFormatPipe,
    PaginationComponent
  ],
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.css']
})
export class PetsComponent implements OnInit, OnDestroy {
  pets: Pet[] = [];
  loading = false;
  searchTerm = '';
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  itemsPerPage = 10;
  
  get paginationConfig(): PaginationConfig {
    return {
      currentPage: this.currentPage,
      totalItems: this.totalItems,
      itemsPerPage: this.itemsPerPage,
      maxVisiblePages: 5
    };
  }
  
  // Modal state
  showDetailModal = false;
  showStatusModal = false;
  selectedPet: Pet | null = null;
  
  // Filters
  selectedSpecies: PetSpecies | '' = '';
  selectedGender: PetGender | '' = '';
  selectedTutorId: string = '';
  
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // Species options
  speciesOptions: SelectOption[] = [
    { value: '', label: 'Todas as espécies' },
    { value: PetSpecies.DOG, label: 'Cão' },
    { value: PetSpecies.CAT, label: 'Gato' },
    { value: PetSpecies.BIRD, label: 'Ave' },
    { value: PetSpecies.FISH, label: 'Peixe' },
    { value: PetSpecies.RABBIT, label: 'Coelho' },
    { value: PetSpecies.HAMSTER, label: 'Hamster' },
    { value: PetSpecies.OTHER, label: 'Outro' }
  ];

  // Gender options
  genderOptions: SelectOption[] = [
    { value: '', label: 'Todos os gêneros' },
    { value: PetGender.MALE, label: 'Macho' },
    { value: PetGender.FEMALE, label: 'Fêmea' }
  ];

  constructor(
    private petService: PetService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    // Configurar debounce para busca
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.searchTerm = searchTerm;
        this.currentPage = 1;
        this.loadPets();
      });
  }

  ngOnInit(): void {
    // Verificar se há tutorId na URL (filtro por tutor específico)
    this.route.queryParams.subscribe(params => {
      if (params['tutorId']) {
        this.selectedTutorId = params['tutorId'];
      }
    });
    
    this.loadPets();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPets(): void {
    this.loading = true;

    const params: PetSearchParams = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      search: this.searchTerm || undefined,
      species: this.selectedSpecies || undefined,
      gender: this.selectedGender || undefined,
      tutorId: this.selectedTutorId || undefined
    };

    this.petService.getPets(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.pets = response.data;
          this.totalPages = response.pagination.pages;
          this.totalItems = response.pagination.total;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar pets:', error);
          this.toastService.showError('Erro ao carregar lista de pets. Tente novamente.');
          this.loading = false;
        }
      });
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  onSpeciesChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedSpecies = value as PetSpecies | '';
    this.currentPage = 1;
    this.loadPets();
  }

  onGenderChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedGender = value as PetGender | '';
    this.currentPage = 1;
    this.loadPets();
  }

  onPageChange(change: PaginationChange): void {
    this.currentPage = change.page;
    this.itemsPerPage = change.itemsPerPage;
    this.loadPets();
  }

  onEditPet(pet: Pet): void {
    this.router.navigate(['/crm/pets/edit', pet.id]);
  }

  onViewPet(pet: Pet): void {
    this.selectedPet = pet;
    this.showDetailModal = true;
  }

  onDetailModalClose(): void {
    this.showDetailModal = false;
    this.selectedPet = null;
  }

  onDetailModalEdit(pet: Pet): void {
    this.showDetailModal = false;
    this.onEditPet(pet);
  }

  onDetailModalManageStatus(pet: Pet): void {
    this.showDetailModal = false;
    this.onManageStatus(pet);
  }

  onManageStatus(pet: Pet): void {
    this.selectedPet = pet;
    this.showStatusModal = true;
  }

  onStatusModalClose(): void {
    this.showStatusModal = false;
    this.selectedPet = null;
  }

  onStatusChange(event: { status: PetStatus; reason?: string }): void {
    if (!this.selectedPet) return;

    this.petService.updatePetStatus(this.selectedPet.id, event.status, event.reason)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedPet) => {
          // Atualizar o pet na lista
          const index = this.pets.findIndex(p => p.id === updatedPet.id);
          if (index !== -1) {
            this.pets[index] = updatedPet;
          }
          
          this.showStatusModal = false;
          this.selectedPet = null;
          this.toastService.showSuccess('Status do pet atualizado com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao atualizar status do pet:', error);
          this.toastService.showError('Erro ao atualizar status do pet. Tente novamente.');
        }
      });
  }

  onAddPet(): void {
    // Sempre deve ter um tutor selecionado para adicionar um pet
    if (this.selectedTutorId) {
      this.router.navigate(['/crm/pets/new', this.selectedTutorId]);
    } else {
      // Se não há tutor selecionado, mostrar mensagem de erro
      this.toastService.showError('Selecione um cliente para adicionar um pet.');
    }
  }

  getSpeciesLabel(species: PetSpecies): string {
    const option = this.speciesOptions.find(opt => opt.value === species);
    return option ? option.label : species;
  }

  getGenderLabel(gender: PetGender): string {
    const option = this.genderOptions.find(opt => opt.value === gender);
    return option ? option.label : gender;
  }

  getAge(birthDate?: string | Date): string {
    if (!birthDate) return 'N/A';
    
    const today = new Date();
    const birth = new Date(birthDate);
    const ageInMs = today.getTime() - birth.getTime();
    const ageInYears = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365.25));
    const ageInMonths = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 30.44));
    
    if (ageInYears === 0) {
      return `${ageInMonths} mes${ageInMonths !== 1 ? 'es' : ''}`;
    }
    
    return `${ageInYears} ano${ageInYears !== 1 ? 's' : ''}`;
  }

  getAppointmentsCount(pet: Pet): number {
    return pet._count?.appointments || 0;
  }

  getMedicalRecordsCount(pet: Pet): number {
    return pet._count?.medicalRecords || 0;
  }

  getStatusColor(status: PetStatus): string {
    const colors = {
      [PetStatus.ACTIVE]: '#10b981',
      [PetStatus.INACTIVE]: '#f59e0b',
      [PetStatus.DECEASED]: '#ef4444',
      [PetStatus.ADOPTED]: '#8b5cf6',
      [PetStatus.LOST]: '#f97316',
      [PetStatus.UNDER_TREATMENT]: '#06b6d4',
      [PetStatus.QUARANTINE]: '#dc2626'
    };
    return colors[status] || '#6b7280';
  }

  getStatusLabel(status: PetStatus): string {
    const labels = {
      [PetStatus.ACTIVE]: 'Ativo',
      [PetStatus.INACTIVE]: 'Inativo',
      [PetStatus.DECEASED]: 'Falecido',
      [PetStatus.ADOPTED]: 'Adotado',
      [PetStatus.LOST]: 'Perdido',
      [PetStatus.UNDER_TREATMENT]: 'Em Tratamento',
      [PetStatus.QUARANTINE]: 'Quarentena'
    };
    return labels[status] || 'Desconhecido';
  }

  getPetAvatar(pet: Pet): string {
    return pet.name.charAt(0).toUpperCase();
  }

  getPetAvatarColor(species: PetSpecies): string {
    const colors = {
      [PetSpecies.DOG]: '#3b82f6',
      [PetSpecies.CAT]: '#8b5cf6',
      [PetSpecies.BIRD]: '#10b981',
      [PetSpecies.FISH]: '#06b6d4',
      [PetSpecies.RABBIT]: '#f59e0b',
      [PetSpecies.HAMSTER]: '#ef4444',
      [PetSpecies.OTHER]: '#6b7280'
    };
    return colors[species] || '#6b7280';
  }
}
