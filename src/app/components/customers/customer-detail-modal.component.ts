import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tutor } from '../../services/tutor.service';
import { ModalComponent, ModalConfig, ButtonComponent } from '../../shared/components';
import { PhoneFormatPipe, CpfFormatPipe, CepFormatPipe } from '../../shared/pipes';

@Component({
  selector: 'app-customer-detail-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent, ButtonComponent, PhoneFormatPipe, CpfFormatPipe, CepFormatPipe],
  template: `
    <app-modal 
      [config]="modalConfig"
      [isOpen]="true"
      (close)="onClose()"
    >
      <!-- Informações Básicas -->
      <div class="section">
        <div class="section-header">
          <div class="customer-avatar">
            <span>{{ customer.name.charAt(0).toUpperCase() }}</span>
          </div>
          <div class="customer-main-info">
            <h3>{{ customer.name }}</h3>
            <div class="status-badge" [style.background-color]="getStatusColor(customer.status)">
              {{ getStatusLabel(customer.status) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Dados Pessoais -->
      <div class="section">
        <h4 class="section-title">Dados Pessoais</h4>
        <div class="info-grid">
          <div class="info-item">
            <label>CPF</label>
            <span>{{ customer.cpf | cpfFormat }}</span>
          </div>
          
          @if (customer.email) {
            <div class="info-item">
              <label>Email</label>
              <span>{{ customer.email }}</span>
            </div>
          }
          
          <div class="info-item">
            <label>Telefone</label>
            <span>{{ customer.phone | phoneFormat }}</span>
          </div>
          
          @if (customer.birthDate) {
            <div class="info-item">
              <label>Data de Nascimento</label>
              <span>{{ customer.birthDate | date:'dd/MM/yyyy' }}</span>
            </div>
          }
        </div>
      </div>

      <!-- Endereço -->
      @if (customer.address || customer.city || customer.state || customer.zipCode) {
        <div class="section">
          <h4 class="section-title">Endereço</h4>
          <div class="info-grid">
            @if (customer.address) {
              <div class="info-item full-width">
                <label>Endereço</label>
                <span>{{ customer.address }}</span>
              </div>
            }
            
            @if (customer.city) {
              <div class="info-item">
                <label>Cidade</label>
                <span>{{ customer.city }}</span>
              </div>
            }
            
            @if (customer.state) {
              <div class="info-item">
                <label>Estado</label>
                <span>{{ customer.state }}</span>
              </div>
            }
            
            @if (customer.zipCode) {
              <div class="info-item">
                <label>CEP</label>
                <span>{{ customer.zipCode | cepFormat }}</span>
              </div>
            }
          </div>
        </div>
      }

      <!-- Pets -->
      <div class="section">
        <div class="section-header-with-actions">
          <h4 class="section-title">Pets ({{ getPetsCount() }})</h4>
          <div class="section-actions">
            <app-button 
              label="Ver Pets"
              icon="check"
              variant="secondary"
              size="sm"
              (clicked)="onViewPets()">
            </app-button>
            <app-button 
              label="Novo Pet"
              icon="plus"
              variant="primary"
              size="sm"
              (clicked)="onAddPet()">
            </app-button>
          </div>
        </div>
        
        @if (getPetsCount() > 0) {
          <div class="pets-grid">
            @for (pet of customer.tutor?.pets || []; track pet.id) {
              <div class="pet-card">
                <div class="pet-avatar">
                  <span>{{ pet.name.charAt(0).toUpperCase() }}</span>
                </div>
                <div class="pet-info">
                  <h5>{{ pet.name }}</h5>
                  <p>{{ getSpeciesLabel(pet.species) }}{{ pet.breed ? ' - ' + pet.breed : '' }}</p>
                  @if (pet.color) {
                    <span class="pet-detail">{{ pet.color }}</span>
                  }
                  @if (pet.weight) {
                    <span class="pet-detail">{{ pet.weight }}kg</span>
                  }
                  @if (pet.birthDate) {
                    <span class="pet-detail">{{ getAge(pet.birthDate) }}</span>
                  }
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="empty-pets">
            <p>Nenhum pet cadastrado para este tutor.</p>
            <app-button 
              label="Cadastrar Primeiro Pet"
              icon="plus"
              variant="primary"
              size="sm"
              (clicked)="onAddPet()">
            </app-button>
          </div>
        }
      </div>

      <!-- Estatísticas -->
      <div class="section">
        <h4 class="section-title">Estatísticas</h4>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ getPetsCount() }}</span>
              <span class="stat-label">Pet{{ getPetsCount() !== 1 ? 's' : '' }}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ getAppointmentsCount() }}</span>
              <span class="stat-label">Consulta{{ getAppointmentsCount() !== 1 ? 's' : '' }}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ getOrdersCount() }}</span>
              <span class="stat-label">Pedido{{ getOrdersCount() !== 1 ? 's' : '' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Informações de Status -->
      @if (customer.status !== 'ACTIVE') {
        <div class="section">
          <h4 class="section-title">Informações de Status</h4>
          <div class="info-grid">
            @if (customer.deactivationReason) {
              <div class="info-item full-width">
                <label>Motivo</label>
                <span>{{ customer.deactivationReason }}</span>
              </div>
            }
            
            @if (customer.deactivatedAt) {
              <div class="info-item">
                <label>Data da Alteração</label>
                <span>{{ customer.deactivatedAt | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
            }
          </div>
        </div>
      }

      <!-- Datas do Sistema -->
      <div class="section">
        <h4 class="section-title">Informações do Sistema</h4>
        <div class="info-grid">
          <div class="info-item">
            <label>Cadastrado em</label>
            <span>{{ customer.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
          </div>
          
          <div class="info-item">
            <label>Última atualização</label>
            <span>{{ customer.updatedAt | date:'dd/MM/yyyy HH:mm' }}</span>
          </div>
        </div>
      </div>
    </app-modal>
  `,
  styles: [`
    .section {
      margin-bottom: 32px;
    }

    .section:last-child {
      margin-bottom: 0;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .customer-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 1.5rem;
    }

    .customer-main-info h3 {
      margin: 0 0 8px 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #111827;
    }

    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .section-title {
      margin: 0 0 16px 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #374151;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 8px;
    }

    .section-header-with-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .section-header-with-actions .section-title {
      margin: 0;
      border-bottom: none;
      padding-bottom: 0;
    }

    .section-actions {
      display: flex;
      gap: 8px;
    }

    .empty-pets {
      text-align: center;
      padding: 32px 16px;
      background-color: #f9fafb;
      border: 2px dashed #d1d5db;
      border-radius: 8px;
      color: #6b7280;
    }

    .empty-pets p {
      margin: 0 0 16px 0;
      font-size: 0.9rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-item.full-width {
      grid-column: 1 / -1;
    }

    .info-item label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .info-item span {
      font-size: 0.95rem;
      color: #111827;
      font-weight: 500;
    }

    .pets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    .pet-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background-color: #f9fafb;
    }

    .pet-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 1rem;
    }

    .pet-info h5 {
      margin: 0 0 4px 0;
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
    }

    .pet-info p {
      margin: 0 0 8px 0;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .pet-detail {
      display: inline-block;
      background-color: #e5e7eb;
      color: #374151;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      margin-right: 6px;
      margin-bottom: 4px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background-color: #f9fafb;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-value {
      display: block;
      font-size: 1.5rem;
      font-weight: 600;
      color: #111827;
    }

    .stat-label {
      display: block;
      font-size: 0.875rem;
      color: #6b7280;
    }

    @media (max-width: 640px) {
      .info-grid {
        grid-template-columns: 1fr;
      }

      .pets-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CustomerDetailModalComponent {
  @Input() customer!: Tutor;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Tutor>();
  @Output() viewPets = new EventEmitter<Tutor>();
  @Output() addPet = new EventEmitter<Tutor>();

  // Configuração do modal usando o design system
  modalConfig: ModalConfig = {
    title: 'Detalhes do Cliente',
    size: 'lg',
    showCloseButton: true,
    closeOnOverlayClick: true,
    showFooter: true,
    footerActions: [
      {
        label: 'Fechar',
        variant: 'secondary',
        onClick: () => this.onClose()
      },
      {
        label: 'Editar Cliente',
        variant: 'primary',
        onClick: () => this.onEdit()
      }
    ]
  };

  getStatusColor(status?: string): string {
    const colors = {
      'ACTIVE': '#10b981',
      'INACTIVE': '#f59e0b',
      'SUSPENDED': '#ef4444',
      'BLACKLISTED': '#6b7280'
    };
    return colors[status as keyof typeof colors] || '#6b7280';
  }

  getStatusLabel(status?: string): string {
    const labels = {
      'ACTIVE': 'Ativo',
      'INACTIVE': 'Inativo',
      'SUSPENDED': 'Suspenso',
      'BLACKLISTED': 'Lista Negra'
    };
    return labels[status as keyof typeof labels] || 'Desconhecido';
  }



  getSpeciesLabel(species: string): string {
    const labels = {
      'DOG': 'Cão',
      'CAT': 'Gato',
      'BIRD': 'Ave',
      'FISH': 'Peixe',
      'REPTILE': 'Réptil',
      'OTHER': 'Outro'
    };
    return labels[species as keyof typeof labels] || species;
  }

  getAge(birthDate: string): string {
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return `${age - 1} anos`;
    }
    
    if (age === 0) {
      const months = monthDiff + 1;
      return `${months} ${months === 1 ? 'mês' : 'meses'}`;
    }
    
    return `${age} ${age === 1 ? 'ano' : 'anos'}`;
  }

  getPetsCount(): number {
    return this.customer.tutor?.pets?.length || 0;
  }

  getAppointmentsCount(): number {
    // Implementar lógica para contar consultas
    return 0;
  }

  getOrdersCount(): number {
    // Implementar lógica para contar pedidos
    return 0;
  }

  onClose(): void {
    this.close.emit();
  }

  onEdit(): void {
    this.edit.emit(this.customer);
  }

  onViewPets(): void {
    this.viewPets.emit(this.customer);
  }

  onAddPet(): void {
    this.addPet.emit(this.customer);
  }
}
