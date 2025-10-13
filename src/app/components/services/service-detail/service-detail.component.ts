import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ServiceService, Service, ServiceCategory } from '../../../services/service.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { PageContainerComponent } from '../../../shared/components/page-container/page-container.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    CardComponent,
    BadgeComponent,
    PageContainerComponent,
    PageHeaderComponent
  ],
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit, OnDestroy {
  service: Service | null = null;
  loading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private serviceService: ServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadService();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadService(): void {
    const serviceId = this.route.snapshot.paramMap.get('id');
    
    if (!serviceId) {
      this.toastService.showError('ID do serviço não fornecido');
      return;
    }

    this.loading = true;

    this.serviceService.getServiceById(serviceId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.service = response.service;
          this.loading = false;
        },
        error: (error) => {
          this.toastService.showError('Erro ao carregar serviço. Tente novamente.');
          this.loading = false;
          console.error('Erro ao carregar serviço:', error);
        }
      });
  }

  onEdit(): void {
    if (this.service) {
      this.router.navigate(['/services', this.service.id, 'edit']);
    }
  }

  onBack(): void {
    this.router.navigate(['/services']);
  }

  onToggleStatus(): void {
    if (!this.service) return;

    const newStatus = !this.service.isActive;
    
    this.serviceService.updateServiceStatus(this.service.id, newStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (this.service) {
            this.service.isActive = newStatus;
            this.toastService.showStatusUpdate(this.service.name, newStatus);
          }
        },
        error: (error) => {
          this.toastService.showError('Erro ao atualizar status do serviço.');
          console.error('Erro ao atualizar status:', error);
        }
      });
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

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusBadgeClass(isActive: boolean): string {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Ativo' : 'Inativo';
  }

  getCategoryBadgeClass(category: ServiceCategory): string {
    const categoryColors: Record<ServiceCategory, string> = {
      [ServiceCategory.CONSULTATION]: 'bg-blue-100 text-blue-800',
      [ServiceCategory.VACCINATION]: 'bg-green-100 text-green-800',
      [ServiceCategory.GROOMING]: 'bg-purple-100 text-purple-800',
      [ServiceCategory.SURGERY]: 'bg-red-100 text-red-800',
      [ServiceCategory.DENTAL]: 'bg-yellow-100 text-yellow-800',
      [ServiceCategory.EMERGENCY]: 'bg-orange-100 text-orange-800',
      [ServiceCategory.OTHER]: 'bg-gray-100 text-gray-800'
    };
    return categoryColors[category] || 'bg-gray-100 text-gray-800';
  }
}


