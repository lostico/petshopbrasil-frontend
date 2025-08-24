import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tutor } from '../../services/tutor.service';

@Component({
  selector: 'app-customer-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Detalhes do Cliente</h2>
          <button class="btn-close" (click)="onClose()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="modal-body">
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
                <span>{{ formatCPF(customer.cpf) }}</span>
              </div>
              
              @if (customer.email) {
                <div class="info-item">
                  <label>Email</label>
                  <span>{{ customer.email }}</span>
                </div>
              }
              
              <div class="info-item">
                <label>Telefone</label>
                <span>{{ formatPhone(customer.phone) }}</span>
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
                    <span>{{ formatCEP(customer.zipCode) }}</span>
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
                <button class="btn-secondary btn-sm" (click)="onViewPets()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Ver Pets
                </button>
                <button class="btn-primary btn-sm" (click)="onAddPet()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Novo Pet
                </button>
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
                <button class="btn-primary btn-sm" (click)="onAddPet()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Cadastrar Primeiro Pet
                </button>
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
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" (click)="onClose()">Fechar</button>
          <button class="btn-primary" (click)="onEdit()">Editar Cliente</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 0 24px;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 16px;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #111827;
    }

    .btn-close {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      color: #6b7280;
      transition: all 0.2s;
    }

    .btn-close:hover {
      background-color: #f3f4f6;
      color: #374151;
    }

    .modal-body {
      padding: 24px;
    }

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

    .btn-sm {
      padding: 6px 12px;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      gap: 4px;
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

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 24px;
      border-top: 1px solid #e5e7eb;
    }

    .btn-secondary {
      padding: 10px 20px;
      border: 1px solid #d1d5db;
      background-color: white;
      color: #374151;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background-color: #f9fafb;
      border-color: #9ca3af;
    }

    .btn-primary {
      padding: 10px 20px;
      border: none;
      background-color: #3b82f6;
      color: white;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary:hover {
      background-color: #2563eb;
    }

    @media (max-width: 640px) {
      .modal-content {
        width: 95%;
        margin: 10px;
      }

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

  formatCEP(cep: string): string {
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
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

  getPetsCount(): number {
    return this.customer.tutor?.pets?.length || 0;
  }

  getAppointmentsCount(): number {
    return this.customer._count?.appointments || 0;
  }

  getOrdersCount(): number {
    return this.customer._count?.orders || 0;
  }

  getAge(birthDate: string | Date): string {
    if (!birthDate) return 'N/A';
    
    const birth = new Date(birthDate);
    const today = new Date();
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    if (years > 0) {
      return `${years} ano${years !== 1 ? 's' : ''}`;
    } else if (months > 0) {
      return `${months} mês${months !== 1 ? 'es' : ''}`;
    } else {
      const days = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
      return `${days} dia${days !== 1 ? 's' : ''}`;
    }
  }

  getSpeciesLabel(species: string): string {
    switch (species) {
      case 'DOG':
        return 'Cão';
      case 'CAT':
        return 'Gato';
      case 'BIRD':
        return 'Ave';
      case 'FISH':
        return 'Peixe';
      case 'RABBIT':
        return 'Coelho';
      case 'HAMSTER':
        return 'Hamster';
      case 'OTHER':
        return 'Outro';
      default:
        return species;
    }
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
