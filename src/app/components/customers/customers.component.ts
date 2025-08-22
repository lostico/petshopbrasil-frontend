import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { TutorService, Tutor, TutorSearchParams } from '../../services/tutor.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    // TODO: Implementar navegação para visualização
    console.log('Visualizar cliente:', customer);
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
}
