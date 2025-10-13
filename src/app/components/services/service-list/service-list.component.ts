import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { ServiceService, Service, ServiceCategory, ServiceSearchParams } from '../../../services/service.service';
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
  selector: 'app-service-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit, OnDestroy {
  services: Service[] = [];
  loading = false;
  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';
  minPrice = '';
  maxPrice = '';
  
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
  
  // Modal de confirmação
  showDeleteModal = false;
  serviceToDelete: Service | null = null;
  
  // Modal de confirmação de status
  showStatusModal = false;
  serviceToToggle: Service | null = null;
  
  // Observables
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  
  // Opções de filtro
  categories = [
    { value: '', label: 'Todas as categorias' },
    { value: ServiceCategory.CONSULTATION, label: 'Consulta' },
    { value: ServiceCategory.VACCINATION, label: 'Vacinação' },
    { value: ServiceCategory.GROOMING, label: 'Banho e Tosa' },
    { value: ServiceCategory.SURGERY, label: 'Cirurgia' },
    { value: ServiceCategory.DENTAL, label: 'Dental' },
    { value: ServiceCategory.EMERGENCY, label: 'Emergência' },
    { value: ServiceCategory.OTHER, label: 'Outros' }
  ];
  
  statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'true', label: 'Ativo' },
    { value: 'false', label: 'Inativo' }
  ];

  constructor(
    private serviceService: ServiceService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.setupSearch();
    this.loadServices();
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
        this.loadServices();
      });
  }

  loadServices(): void {
    this.loading = true;

    const params: ServiceSearchParams = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      search: this.searchTerm || undefined,
      category: this.selectedCategory as ServiceCategory || undefined,
      isActive: this.selectedStatus ? this.selectedStatus === 'true' : undefined,
      minPrice: this.minPrice ? parseFloat(this.minPrice) : undefined,
      maxPrice: this.maxPrice ? parseFloat(this.maxPrice) : undefined
    };

    this.serviceService.getAllServices(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.services = response.data;
          this.totalPages = response.pagination.pages;
          this.totalItems = response.pagination.total;
          this.currentPage = response.pagination.page;
          
          this.loading = false;
        },
        error: (error) => {
          this.toastService.showError('Erro ao carregar serviços. Tente novamente.');
          this.loading = false;
          console.error('Erro ao carregar serviços:', error);
        }
      });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadServices();
  }

  onPageChange(change: PaginationChange): void {
    this.currentPage = change.page;
    this.itemsPerPage = change.itemsPerPage;
    this.loadServices();
  }

  onNewService(): void {
    this.router.navigate(['/services/new']);
  }

  onEditService(service: Service): void {
    this.router.navigate(['/services', service.id, 'edit']);
  }

  onViewService(service: Service): void {
    this.router.navigate(['/services', service.id]);
  }

  onToggleStatus(service: Service): void {
    this.serviceToToggle = service;
    this.showStatusModal = true;
  }

  confirmToggleStatus(): void {
    if (!this.serviceToToggle) return;

    const newStatus = !this.serviceToToggle.isActive;
    const serviceName = this.serviceToToggle.name;
    
    this.serviceService.updateServiceStatus(this.serviceToToggle.id, newStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.serviceToToggle!.isActive = newStatus;
          this.showStatusModal = false;
          this.serviceToToggle = null;
          
          // Mostrar toast de sucesso
          this.toastService.showStatusUpdate(serviceName, newStatus);
        },
        error: (error) => {
          this.showStatusModal = false;
          this.serviceToToggle = null;
          
          // Mostrar toast de erro
          this.toastService.showError('Erro ao atualizar status do serviço.');
          console.error('Erro ao atualizar status:', error);
        }
      });
  }

  cancelToggleStatus(): void {
    this.showStatusModal = false;
    this.serviceToToggle = null;
  }

  onDeleteService(service: Service): void {
    this.serviceToDelete = service;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.serviceToDelete) return;

    const serviceName = this.serviceToDelete.name;

    this.serviceService.deleteService(this.serviceToDelete.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.services = this.services.filter(s => s.id !== this.serviceToDelete!.id);
          this.showDeleteModal = false;
          this.serviceToDelete = null;
          
          // Mostrar toast de sucesso
          this.toastService.showServiceDeleted(serviceName);
        },
        error: (error) => {
          this.showDeleteModal = false;
          this.serviceToDelete = null;
          
          // Mostrar toast de erro
          this.toastService.showError('Erro ao deletar serviço.');
          console.error('Erro ao deletar serviço:', error);
        }
      });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.serviceToDelete = null;
  }

  getCategoryName(category: ServiceCategory): string {
    return this.serviceService.getCategoryName(category);
  }

  formatPrice(price: number): string {
    return this.serviceService.formatPrice(price);
  }

  formatDuration(duration: number): string {
    return this.serviceService.formatDuration(duration);
  }

  getStatusBadgeClass(isActive: boolean): string {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Ativo' : 'Inativo';
  }


  
  // Propriedade ServiceCategory para uso no template
  ServiceCategory = ServiceCategory;
}
