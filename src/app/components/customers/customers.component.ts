import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { TutorService, Tutor, TutorSearchParams } from '../../services/tutor.service';
import { StatusModalComponent, TutorStatus } from './status-modal.component';
import { CustomerDetailModalComponent } from './customer-detail-modal.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusModalComponent, CustomerDetailModalComponent],
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

  onStatusChange(event: { status: TutorStatus; reason?: string }): void {
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

  getPetsCount(customer: Tutor): number {
    return customer.tutor?.pets?.length || 0;
  }

  getAppointmentsCount(customer: Tutor): number {
    return customer._count?.appointments || 0;
  }

  getOrdersCount(customer: Tutor): number {
    return customer._count?.orders || 0;
  }

  getStatusColor(status?: string): string {
    switch (status) {
      case 'ACTIVE':
        return '#10b981';
      case 'INACTIVE':
        return '#f59e0b';
      case 'SUSPENDED':
        return '#ef4444';
      case 'BLACKLISTED':
        return '#1f2937';
      default:
        return '#10b981';
    }
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
