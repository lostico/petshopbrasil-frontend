import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { TutorService, Tutor, TutorSearchParams } from '../../services/tutor.service';
import { StatusModalComponent } from './status-modal.component';
import { CustomerDetailModalComponent } from './customer-detail-modal.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { PhoneFormatPipe } from '../../shared/pipes/phone-format.pipe';
import { CpfFormatPipe } from '../../shared/pipes/cpf-format.pipe';



@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StatusModalComponent,
    CustomerDetailModalComponent,
    ButtonComponent,
    InputComponent,
    CardComponent,
    BadgeComponent,
    AlertComponent,
    PaginationComponent,
    PhoneFormatPipe,
    CpfFormatPipe
  ],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit, OnDestroy {
  customers: Tutor[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  itemsPerPage = 10;
  
  // Pagination config
  paginationConfig = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    showInfo: true,
    showPageNumbers: true,
    maxVisiblePages: 5
  };
  
  // Modal state
  showStatusModal = false;
  showDetailModal = false;
  selectedCustomer: Tutor | null = null;
  
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private tutorService: TutorService,
    private router: Router
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
        this.loadCustomers();
      });
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCustomers(): void {
    this.loading = true;
    this.error = '';

    const params: TutorSearchParams = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      search: this.searchTerm || undefined
    };

    this.tutorService.getTutors(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.customers = response.data;
          this.totalPages = response.pagination.pages;
          this.totalItems = response.pagination.total;
          
          // Atualizar configuração da paginação
          this.paginationConfig = {
            ...this.paginationConfig,
            currentPage: this.currentPage,
            totalPages: this.totalPages,
            totalItems: this.totalItems,
            itemsPerPage: this.itemsPerPage
          };
          
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar clientes:', error);
          this.error = 'Erro ao carregar lista de clientes. Tente novamente.';
          this.loading = false;
        }
      });
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadCustomers();
    }
  }

  onEditCustomer(customer: Tutor): void {
    this.router.navigate(['/crm/customers/edit', customer.id]);
  }

  onViewCustomer(customer: Tutor): void {
    this.selectedCustomer = customer;
    this.showDetailModal = true;
  }

  onDeleteCustomer(customer: Tutor): void {
    if (confirm(`Tem certeza que deseja desativar o cliente "${customer.name}"?`)) {
      this.tutorService.deactivateTutor(customer.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadCustomers();
          },
          error: (error) => {
            console.error('Erro ao desativar cliente:', error);
            this.error = 'Erro ao desativar cliente. Tente novamente.';
          }
        });
    }
  }

  onManageStatus(customer: Tutor): void {
    this.selectedCustomer = customer;
    this.showStatusModal = true;
  }

  onStatusModalClose(): void {
    this.showStatusModal = false;
    this.selectedCustomer = null;
  }

  onDetailModalClose(): void {
    this.showDetailModal = false;
    this.selectedCustomer = null;
  }

  onDetailModalEdit(customer: Tutor): void {
    this.showDetailModal = false;
    this.onEditCustomer(customer);
  }

  onDetailModalViewPets(customer: Tutor): void {
    this.showDetailModal = false;
    this.router.navigate(['/crm/pets'], { 
      queryParams: { tutorId: customer.id } 
    });
  }

  onDetailModalAddPet(customer: Tutor): void {
    this.showDetailModal = false;
    this.router.navigate(['/crm/pets/new', customer.id]);
  }

  onStatusChange(event: { status: string; reason?: string }): void {
    if (!this.selectedCustomer) return;

    const { status, reason } = event;
    let request$;

    switch (status) {
      case 'INACTIVE':
        request$ = this.tutorService.deactivateTutorStatus(this.selectedCustomer.id, reason);
        break;
      case 'SUSPENDED':
        request$ = this.tutorService.suspendTutor(this.selectedCustomer.id, reason);
        break;
      case 'BLACKLISTED':
        if (!reason) {
          this.error = 'Motivo é obrigatório para adicionar à lista negra';
          return;
        }
        request$ = this.tutorService.blacklistTutor(this.selectedCustomer.id, reason);
        break;
      case 'ACTIVE':
        request$ = this.tutorService.reactivateTutor(this.selectedCustomer.id);
        break;
      default:
        return;
    }

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.showStatusModal = false;
        this.selectedCustomer = null;
        this.loadCustomers();
      },
      error: (error) => {
        console.error('Erro ao alterar status do cliente:', error);
        this.error = 'Erro ao alterar status do cliente. Tente novamente.';
      }
    });
  }

  onAddCustomer(): void {
    this.router.navigate(['/crm/customers/new']);
  }



  getPetsCount(customer: Tutor): number {
    return customer.tutor?.pets?.length || 0;
  }

  getAppointmentsCount(customer: Tutor): number {
    return customer._count?.appointments || 0;
  }

  getOrdersCount(customer: Tutor): number {
    return customer._count?.orders || 0;
  }

  getStatusVariant(status?: string): 'success' | 'warning' | 'danger' | 'secondary' {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'warning';
      case 'SUSPENDED':
        return 'danger';
      case 'BLACKLISTED':
        return 'secondary';
      default:
        return 'success';
    }
  }

  getStatusColor(status?: string): string {
    const colors = {
      'ACTIVE': '#10b981',
      'INACTIVE': '#f59e0b',
      'SUSPENDED': '#ef4444',
      'BLACKLISTED': '#6b7280'
    };
    return colors[status as keyof typeof colors] || '#6b7280';
  }

  getCustomerAvatarColor(name: string): string {
    const colors = [
      '#3b82f6', // blue
      '#8b5cf6', // purple
      '#10b981', // green
      '#06b6d4', // cyan
      '#f59e0b', // amber
      '#ef4444', // red
      '#f97316', // orange
      '#ec4899', // pink
      '#6366f1', // indigo
      '#84cc16'  // lime
    ];
    
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }

  getStatusLabel(status?: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'Ativo';
      case 'INACTIVE':
        return 'Inativo';
      case 'SUSPENDED':
        return 'Suspenso';
      case 'BLACKLISTED':
        return 'Lista Negra';
      default:
        return 'Ativo';
    }
  }
}
