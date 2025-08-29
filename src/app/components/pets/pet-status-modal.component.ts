import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pet, PetStatus } from '../../services/pet.service';
import { ButtonComponent } from '../../shared/components/button/button.component';

export interface PetStatusOption {
  value: PetStatus;
  label: string;
  description: string;
  color: string;
  icon: string;
}

@Component({
  selector: 'app-pet-status-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
     template: `
     <div class="modal-overlay" (click)="onClose()">
       <div class="modal-container" (click)="$event.stopPropagation()">
         <div class="modal-header">
           <h2 class="modal-title">Gerenciar Status do Pet</h2>
           <button class="modal-close" (click)="onClose()">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <line x1="18" y1="6" x2="6" y2="18"></line>
               <line x1="6" y1="6" x2="18" y2="18"></line>
             </svg>
           </button>
         </div>

         <div class="modal-body">
          <div class="pet-info">
            <div class="pet-avatar" [style.background-color]="getPetAvatarColor(pet.species)">
              <span>{{ getPetAvatar(pet) }}</span>
            </div>
            <div class="pet-details">
              <h3>{{ pet.name }}</h3>
              <p>{{ getSpeciesLabel(pet.species) }} - {{ pet.breed || 'Raça não informada' }}</p>
              @if (pet.tutor) {
                <p class="tutor-info">Tutor: {{ pet.tutor.name }}</p>
              }
            </div>
          </div>

          <div class="status-section">
            <h4>Status Atual</h4>
            <div class="current-status" [class]="'status-' + pet.status.toLowerCase()">
              <span class="status-badge">
                {{ getStatusLabel(pet.status) }}
              </span>
            </div>
          </div>

          <div class="status-options">
            <h4>Alterar Status</h4>
            <div class="options-grid">
              @for (option of statusOptions; track option.value) {
                <div 
                  class="status-option" 
                  [class.selected]="selectedStatus === option.value"
                  [class.disabled]="option.value === pet.status"
                  (click)="selectStatus(option.value)"
                >
                  <div class="option-icon" [style.background-color]="option.color">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path [attr.d]="option.icon"></path>
                    </svg>
                  </div>
                  <div class="option-content">
                    <h5>{{ option.label }}</h5>
                    <p>{{ option.description }}</p>
                  </div>
                  @if (selectedStatus === option.value) {
                    <div class="option-check">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          @if (selectedStatus && selectedStatus !== pet.status) {
            <div class="reason-section">
              <h4>Motivo da Alteração</h4>
              <textarea 
                [(ngModel)]="reason" 
                placeholder="Descreva o motivo da alteração de status..."
                rows="3"
                class="reason-input"
              ></textarea>
              @if (selectedStatus === 'DECEASED' && !reason.trim()) {
                <p class="error-text">Motivo é obrigatório para marcar pet como falecido</p>
              }
            </div>
          }
        </div>

        <div class="modal-footer">
          <app-button
            variant="ghost"
            label="Cancelar"
            (clicked)="onClose()">
          </app-button>
          <app-button
            variant="primary"
            label="Salvar Alterações"
            [disabled]="!canSave()"
            (clicked)="onSave()">
          </app-button>
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
       padding: 1rem;
     }

     .modal-container {
       background: white;
       border-radius: 12px;
       width: 90%;
       max-width: 600px;
       max-height: 90vh;
       display: flex;
       flex-direction: column;
       box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
       overflow: hidden;
     }

     .modal-header {
       display: flex;
       justify-content: space-between;
       align-items: center;
       padding: 24px 24px 0 24px;
       border-bottom: 1px solid #e5e7eb;
       padding-bottom: 16px;
       flex-shrink: 0;
     }

     .modal-title {
       margin: 0;
       font-size: 1.5rem;
       font-weight: 600;
       color: #111827;
     }

     .modal-close {
       background: none;
       border: none;
       cursor: pointer;
       padding: 8px;
       border-radius: 6px;
       color: #6b7280;
       transition: all 0.2s;
     }

     .modal-close:hover {
       background-color: #f3f4f6;
       color: #374151;
     }

     .modal-body {
       padding: 24px;
       flex: 1;
       overflow-y: auto;
     }

    .pet-info {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      padding: 16px;
      background-color: #f9fafb;
      border-radius: 8px;
    }

    .pet-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 1.2rem;
    }

    .pet-details h3 {
      margin: 0 0 4px 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #111827;
    }

    .pet-details p {
      margin: 0 0 2px 0;
      color: #6b7280;
      font-size: 0.9rem;
    }

    .tutor-info {
      font-size: 0.8rem;
      color: #9ca3af;
      font-style: italic;
    }

    .status-section {
      margin-bottom: 24px;
    }

    .status-section h4 {
      margin: 0 0 12px 0;
      font-size: 1rem;
      font-weight: 600;
      color: #374151;
    }

    .current-status {
      display: inline-block;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-active .status-badge {
      background-color: #dcfce7;
      color: #166534;
    }

    .status-inactive .status-badge {
      background-color: #fef3c7;
      color: #92400e;
    }

    .status-deceased .status-badge {
      background-color: #fef2f2;
      color: #dc2626;
    }

    .status-adopted .status-badge {
      background-color: #f3e8ff;
      color: #7c3aed;
    }

    .status-lost .status-badge {
      background-color: #fff7ed;
      color: #ea580c;
    }

    .status-under_treatment .status-badge {
      background-color: #ecfeff;
      color: #0891b2;
    }

    .status-quarantine .status-badge {
      background-color: #fef2f2;
      color: #dc2626;
    }

    .status-options h4 {
      margin: 0 0 16px 0;
      font-size: 1rem;
      font-weight: 600;
      color: #374151;
    }

    .options-grid {
      display: grid;
      gap: 12px;
    }

    .status-option {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }

    .status-option:hover:not(.disabled) {
      border-color: #d1d5db;
      background-color: #f9fafb;
    }

    .status-option.selected {
      border-color: #3b82f6;
      background-color: #eff6ff;
    }

    .status-option.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .option-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .option-content h5 {
      margin: 0 0 4px 0;
      font-size: 0.9rem;
      font-weight: 600;
      color: #111827;
    }

    .option-content p {
      margin: 0;
      font-size: 0.8rem;
      color: #6b7280;
      line-height: 1.4;
    }

    .option-check {
      margin-left: auto;
      color: #3b82f6;
    }

    .reason-section {
      margin-top: 24px;
    }

    .reason-section h4 {
      margin: 0 0 12px 0;
      font-size: 1rem;
      font-weight: 600;
      color: #374151;
    }

    .reason-input {
      width: 100%;
      padding: 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.9rem;
      resize: vertical;
      font-family: inherit;
    }

    .reason-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .error-text {
      color: #dc2626;
      font-size: 0.8rem;
      margin: 8px 0 0 0;
    }

              .modal-footer {
       display: flex;
       justify-content: flex-end;
       gap: 12px;
       padding: 24px;
       border-top: 1px solid #e5e7eb;
       background-color: #f9fafb;
       flex-shrink: 0;
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

    .btn-primary:hover:not(:disabled) {
      background-color: #2563eb;
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class PetStatusModalComponent {
  @Input() pet!: Pet;
  @Output() close = new EventEmitter<void>();
  @Output() statusChange = new EventEmitter<{ status: PetStatus; reason?: string }>();

  selectedStatus: PetStatus = PetStatus.ACTIVE;
  reason = '';

  statusOptions: PetStatusOption[] = [
    {
      value: PetStatus.ACTIVE,
      label: 'Ativo',
      description: 'Pet ativo e disponível para atendimentos',
      color: '#10b981',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      value: PetStatus.INACTIVE,
      label: 'Inativo',
      description: 'Pet inativo - não permite novos agendamentos',
      color: '#f59e0b',
      icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
    },
    {
      value: PetStatus.DECEASED,
      label: 'Falecido',
      description: 'Pet falecido - bloqueia atendimentos, mantém histórico',
      color: '#ef4444',
      icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      value: PetStatus.ADOPTED,
      label: 'Adotado',
      description: 'Pet adotado por outro tutor - bloqueia atendimentos',
      color: '#8b5cf6',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    },
    {
      value: PetStatus.LOST,
      label: 'Perdido',
      description: 'Pet perdido - bloqueia atendimentos temporariamente',
      color: '#f97316',
      icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z'
    },
    {
      value: PetStatus.UNDER_TREATMENT,
      label: 'Em Tratamento',
      description: 'Pet em tratamento intensivo - agendamentos especiais',
      color: '#06b6d4',
      icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
    },
    {
      value: PetStatus.QUARANTINE,
      label: 'Quarentena',
      description: 'Pet em quarentena - bloqueia atendimentos',
      color: '#dc2626',
      icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728'
    }
  ];

  ngOnInit(): void {
    this.selectedStatus = this.pet.status;
  }

  selectStatus(status: PetStatus): void {
    if (status !== this.pet.status) {
      this.selectedStatus = status;
    }
  }

  getStatusLabel(status: PetStatus): string {
    const option = this.statusOptions.find(opt => opt.value === status);
    return option?.label || status;
  }

  getPetAvatar(pet: Pet): string {
    return pet.name.charAt(0).toUpperCase();
  }

  getPetAvatarColor(species: string): string {
    const colors: { [key: string]: string } = {
      'DOG': '#3b82f6',
      'CAT': '#8b5cf6',
      'BIRD': '#10b981',
      'FISH': '#06b6d4',
      'RABBIT': '#f59e0b',
      'HAMSTER': '#ef4444',
      'OTHER': '#6b7280'
    };
    return colors[species] || '#6b7280';
  }

  getSpeciesLabel(species: string): string {
    const labels: { [key: string]: string } = {
      'DOG': 'Cão',
      'CAT': 'Gato',
      'BIRD': 'Ave',
      'FISH': 'Peixe',
      'RABBIT': 'Coelho',
      'HAMSTER': 'Hamster',
      'OTHER': 'Outro'
    };
    return labels[species] || species;
  }

  canSave(): boolean {
    if (this.selectedStatus === this.pet.status) {
      return false;
    }
    
    if (this.selectedStatus === PetStatus.DECEASED && !this.reason.trim()) {
      return false;
    }
    
    return true;
  }

  onSave(): void {
    if (this.canSave()) {
      this.statusChange.emit({
        status: this.selectedStatus,
        reason: this.reason.trim() || undefined
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
