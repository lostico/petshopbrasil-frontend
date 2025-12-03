import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { VaccineService, Vaccine, VaccineType, Species, VaccineSearchParams } from '../../../services/vaccine.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { PaginationComponent, PaginationConfig, PaginationChange } from '../../../shared/components/pagination/pagination.component';
import { PageContainerComponent } from '../../../shared/components/page-container/page-container.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-vaccine-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    CardComponent,
    BadgeComponent,
    ModalComponent,
    PaginationComponent,
    PageContainerComponent,
    PageHeaderComponent
  ],
  templateUrl: './vaccine-list.component.html',
  styleUrls: ['./vaccine-list.component.css']
})
export class VaccineListComponent implements OnInit, OnDestroy {
  vaccines: Vaccine[] = [];
  loading = false;
  searchTerm = '';
  selectedType = '';
  selectedSpecies = '';
  selectedStatus = '';
  
  // Paginação
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
  
  // Modal de confirmação de exclusão
  showDeleteModal = false;
  vaccineToDelete: Vaccine | null = null;
  
  // Modal de confirmação de status
  showStatusModal = false;
  vaccineToToggle: Vaccine | null = null;
  
  // Observables
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  
  // Opções de filtro
  typeOptions = [
    { value: '', label: 'Todos os tipos' },
    { value: VaccineType.CORE, label: 'Essencial' },
    { value: VaccineType.NON_CORE, label: 'Não Essencial' },
    { value: VaccineType.ANNUAL, label: 'Anual' },
    { value: VaccineType.BOOSTER, label: 'Reforço' }
  ];
  
  speciesOptions = [
    { value: '', label: 'Todas as espécies' },
    { value: Species.DOG, label: 'Cão' },
    { value: Species.CAT, label: 'Gato' },
    { value: Species.BIRD, label: 'Ave' },
    { value: Species.FISH, label: 'Peixe' },
    { value: Species.RABBIT, label: 'Coelho' },
    { value: Species.HAMSTER, label: 'Hamster' },
    { value: Species.OTHER, label: 'Outro' }
  ];
  
  statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'true', label: 'Ativo' },
    { value: 'false', label: 'Inativo' }
  ];

  constructor(
    private vaccineService: VaccineService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupSearch();
    this.loadVaccines();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();
  }

  private setupSearch(): void {
    this.searchSubject
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.loadVaccines();
      });
  }

  loadVaccines(): void {
    this.loading = true;

    const params: VaccineSearchParams = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      search: this.searchTerm || undefined,
      type: this.selectedType as VaccineType || undefined,
      species: this.selectedSpecies as Species || undefined,
      isActive: this.selectedStatus ? this.selectedStatus === 'true' : undefined
    };

    this.vaccineService.getAllVaccines(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.vaccines = response.data;
          this.totalPages = response.pagination.pages;
          this.totalItems = response.pagination.total;
          this.currentPage = response.pagination.page;
          
          this.loading = false;
        },
        error: (error) => {
          this.toastService.showError('Erro ao carregar vacinas. Tente novamente.');
          this.loading = false;
          console.error('Erro ao carregar vacinas:', error);
        }
      });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadVaccines();
  }

  onPageChange(change: PaginationChange): void {
    this.currentPage = change.page;
    this.itemsPerPage = change.itemsPerPage;
    this.loadVaccines();
  }

  getTypeName(type: VaccineType): string {
    return this.vaccineService.getTypeName(type);
  }

  getSpeciesName(species: Species): string {
    return this.vaccineService.getSpeciesName(species);
  }

  getTypeBadgeClass(type: VaccineType): string {
    const classes: Record<VaccineType, string> = {
      [VaccineType.CORE]: 'bg-blue-100 text-blue-800',
      [VaccineType.NON_CORE]: 'bg-gray-100 text-gray-800',
      [VaccineType.ANNUAL]: 'bg-green-100 text-green-800',
      [VaccineType.BOOSTER]: 'bg-purple-100 text-purple-800'
    };
    return classes[type] || 'bg-gray-100 text-gray-800';
  }

  getStatusBadgeClass(isActive: boolean): string {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Ativo' : 'Inativo';
  }

  onNewVaccine(): void {
    this.router.navigate(['/vaccines/new']);
  }

  onEditVaccine(vaccine: Vaccine): void {
    this.router.navigate(['/vaccines', vaccine.id, 'edit']);
  }

  onViewVaccine(vaccine: Vaccine): void {
    this.router.navigate(['/vaccines', vaccine.id]);
  }

  onToggleStatus(vaccine: Vaccine): void {
    this.vaccineToToggle = vaccine;
    this.showStatusModal = true;
  }

  confirmToggleStatus(): void {
    if (!this.vaccineToToggle) return;

    const newStatus = !this.vaccineToToggle.isActive;
    const vaccineName = this.vaccineToToggle.name;
    
    this.vaccineService.updateVaccineStatus(this.vaccineToToggle.id, newStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const index = this.vaccines.findIndex(v => v.id === this.vaccineToToggle!.id);
          if (index > -1) {
            this.vaccines[index] = response.vaccine;
          }
          
          this.showStatusModal = false;
          this.vaccineToToggle = null;
          
          const action = newStatus ? 'ativada' : 'desativada';
          this.toastService.showSuccess(`Vacina "${vaccineName}" ${action} com sucesso!`);
        },
        error: (error) => {
          this.showStatusModal = false;
          this.vaccineToToggle = null;
          
          this.handleStatusError(error);
        }
      });
  }

  cancelToggleStatus(): void {
    this.showStatusModal = false;
    this.vaccineToToggle = null;
  }

  private handleStatusError(error: any): void {
    let errorMessage = 'Erro ao atualizar status da vacina. Tente novamente.';
    
    if (error?.error?.message) {
      errorMessage = error.error.message;
    } else if (error?.status === 404) {
      errorMessage = 'Vacina não encontrada.';
    } else if (error?.status === 400) {
      errorMessage = 'Dados inválidos. Verifique os campos.';
    } else if (error?.status === 401) {
      errorMessage = 'Sessão expirada. Faça login novamente.';
    } else if (error?.status === 403) {
      errorMessage = 'Você não tem permissão para atualizar esta vacina.';
    } else if (error?.status === 500) {
      errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
    }
    
    this.toastService.showError(errorMessage);
    console.error('Erro ao atualizar status:', error);
  }

  onDeleteVaccine(vaccine: Vaccine): void {
    this.vaccineToDelete = vaccine;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.vaccineToDelete) return;

    const vaccineName = this.vaccineToDelete.name;
    const hasVaccinations = (this.vaccineToDelete._count?.vaccinations || 0) > 0;

    this.vaccineService.deleteVaccine(this.vaccineToDelete.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.showDeleteModal = false;
          
          if (response.vaccine) {
            // Soft delete - vacina foi desativada
            const vaccineId = this.vaccineToDelete?.id;
            if (vaccineId) {
              const index = this.vaccines.findIndex(v => v.id === vaccineId);
              if (index > -1) {
                this.vaccines[index] = response.vaccine;
              }
            }
            const vaccinationCount = this.vaccineToDelete?._count?.vaccinations || 0;
            this.toastService.showSuccess(
              `A vacina "${vaccineName}" foi desativada pois possui ${vaccinationCount} vacinação(ões) registrada(s).`
            );
          } else {
            // Hard delete - vacina foi deletada permanentemente
            const vaccineId = this.vaccineToDelete?.id;
            if (vaccineId) {
              this.vaccines = this.vaccines.filter(v => v.id !== vaccineId);
              this.totalItems--;
            }
            this.toastService.showSuccess(`Vacina "${vaccineName}" deletada com sucesso!`);
          }
          
          this.vaccineToDelete = null;
        },
        error: (error) => {
          this.showDeleteModal = false;
          this.vaccineToDelete = null;
          
          this.handleDeleteError(error);
        }
      });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.vaccineToDelete = null;
  }

  private handleDeleteError(error: any): void {
    let errorMessage = 'Erro ao deletar vacina. Tente novamente.';
    
    if (error?.error?.message) {
      errorMessage = error.error.message;
    } else if (error?.status === 404) {
      errorMessage = 'Vacina não encontrada.';
    } else if (error?.status === 401) {
      errorMessage = 'Sessão expirada. Faça login novamente.';
    } else if (error?.status === 403) {
      errorMessage = 'Você não tem permissão para deletar vacinas.';
    } else if (error?.status === 500) {
      errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
    }
    
    this.toastService.showError(errorMessage);
    console.error('Erro ao deletar vacina:', error);
  }

  // Propriedades para uso no template
  VaccineType = VaccineType;
  Species = Species;
}

