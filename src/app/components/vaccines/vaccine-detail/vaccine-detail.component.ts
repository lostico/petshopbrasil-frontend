import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { VaccineService, Vaccine, VaccineType, Species } from '../../../services/vaccine.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { PageContainerComponent } from '../../../shared/components/page-container/page-container.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-vaccine-detail',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    CardComponent,
    BadgeComponent,
    PageContainerComponent,
    PageHeaderComponent
  ],
  templateUrl: './vaccine-detail.component.html',
  styleUrls: ['./vaccine-detail.component.css']
})
export class VaccineDetailComponent implements OnInit, OnDestroy {
  vaccine: Vaccine | null = null;
  loading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private vaccineService: VaccineService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadVaccine();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadVaccine(): void {
    const vaccineId = this.route.snapshot.paramMap.get('id');
    
    if (!vaccineId) {
      this.toastService.showError('ID da vacina não fornecido');
      this.router.navigate(['/vaccines']);
      return;
    }

    this.loading = true;

    this.vaccineService.getVaccineById(vaccineId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.vaccine = response.vaccine;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.handleError(error);
        }
      });
  }

  private handleError(error: any): void {
    let errorMessage = 'Erro ao carregar vacina. Tente novamente.';
    
    if (error?.error?.message) {
      errorMessage = error.error.message;
    } else if (error?.status === 404) {
      errorMessage = 'Vacina não encontrada.';
      this.router.navigate(['/vaccines']);
    } else if (error?.status === 401) {
      errorMessage = 'Sessão expirada. Faça login novamente.';
    } else if (error?.status === 403) {
      errorMessage = 'Você não tem permissão para visualizar esta vacina.';
    } else if (error?.status === 500) {
      errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
    }
    
    this.toastService.showError(errorMessage);
    console.error('Erro ao carregar vacina:', error);
    
    if (error?.status === 404 || error?.status === 401) {
      setTimeout(() => {
        this.router.navigate(['/vaccines']);
      }, 2000);
    }
  }

  onEdit(): void {
    if (this.vaccine) {
      this.router.navigate(['/vaccines', this.vaccine.id, 'edit']);
    }
  }

  onBack(): void {
    this.router.navigate(['/vaccines']);
  }

  getTypeName(type: VaccineType): string {
    return this.vaccineService.getTypeName(type);
  }

  getSpeciesName(species: Species): string {
    return this.vaccineService.getSpeciesName(species);
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

  getTypeBadgeClass(type: VaccineType): string {
    const typeColors: Record<VaccineType, string> = {
      [VaccineType.CORE]: 'bg-blue-100 text-blue-800',
      [VaccineType.NON_CORE]: 'bg-gray-100 text-gray-800',
      [VaccineType.ANNUAL]: 'bg-green-100 text-green-800',
      [VaccineType.BOOSTER]: 'bg-purple-100 text-purple-800'
    };
    return typeColors[type] || 'bg-gray-100 text-gray-800';
  }

  // Propriedades para uso no template
  VaccineType = VaccineType;
  Species = Species;
}

