# Exemplo de Refatoração - Modal de Status

## 📋 Contexto

Este exemplo mostra como refatorar o modal de status de clientes (`status-modal.component.ts`) para usar o componente padronizado do design system.

## 🔄 Antes da Refatoração

### Template Original
```typescript
@Component({
  selector: 'app-status-modal',
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Gerenciar Status do Cliente</h2>
          <button class="btn-close" (click)="onClose()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <!-- Conteúdo específico do modal -->
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" (click)="onClose()">Cancelar</button>
          <button 
            class="btn-primary" 
            [disabled]="!canSave()"
            (click)="onSave()"
          >
            Salvar Alterações
          </button>
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
      max-width: 600px;
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

    /* ... mais estilos ... */
  `]
})
```

## ✅ Depois da Refatoração

### Template Refatorado
```typescript
@Component({
  selector: 'app-status-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <app-modal 
      [config]="modalConfig"
      [isOpen]="true"
      (close)="onClose()"
    >
      <!-- Conteúdo específico do modal -->
      <div class="customer-info">
        <div class="customer-avatar">
          <span>{{ customer.name.charAt(0).toUpperCase() }}</span>
        </div>
        <div class="customer-details">
          <h3>{{ customer.name }}</h3>
          <p>{{ formatCPF(customer.cpf) }}</p>
        </div>
      </div>

      <div class="status-section">
        <h4>Status Atual</h4>
        <div class="current-status" [class]="'status-' + customer.status?.toLowerCase()">
          <span class="status-badge">
            {{ getStatusLabel(customer.status || 'ACTIVE') }}
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
              [class.disabled]="option.value === customer.status"
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

      @if (selectedStatus && selectedStatus !== customer.status) {
        <div class="reason-section">
          <h4>Motivo da Alteração</h4>
          <textarea 
            [(ngModel)]="reason" 
            placeholder="Descreva o motivo da alteração de status..."
            rows="3"
            class="reason-input"
          ></textarea>
          @if (selectedStatus === 'BLACKLISTED' && !reason.trim()) {
            <p class="error-text">Motivo é obrigatório para adicionar à lista negra</p>
          }
        </div>
      }
    </app-modal>
  `,
  styles: [`
    /* Apenas estilos específicos do conteúdo */
    .customer-info {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      padding: 16px;
      background-color: #f9fafb;
      border-radius: 8px;
    }

    .customer-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 1.2rem;
    }

    .customer-details h3 {
      margin: 0 0 4px 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #111827;
    }

    .customer-details p {
      margin: 0;
      color: #6b7280;
      font-size: 0.9rem;
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

    .status-suspended .status-badge {
      background-color: #fef2f2;
      color: #dc2626;
    }

    .status-blacklisted .status-badge {
      background-color: #1f2937;
      color: #f9fafb;
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
  `]
})
export class StatusModalComponent {
  @Input() customer!: Tutor;
  @Output() close = new EventEmitter<void>();
  @Output() statusChange = new EventEmitter<{ status: TutorStatus; reason?: string }>();

  selectedStatus: TutorStatus = 'ACTIVE';
  reason = '';

  // Configuração do modal usando o design system
  modalConfig: ModalConfig = {
    title: 'Gerenciar Status do Cliente',
    size: 'md',
    showCloseButton: true,
    closeOnOverlayClick: true,
    showFooter: true,
    footerActions: [
      {
        label: 'Cancelar',
        variant: 'secondary',
        onClick: () => this.onClose()
      },
      {
        label: 'Salvar Alterações',
        variant: 'primary',
        disabled: !this.canSave(),
        onClick: () => this.onSave()
      }
    ]
  };

  // ... resto da lógica do componente permanece igual
}
```

## 📊 Comparação: Antes vs Depois

| **Aspecto** | **Antes** | **Depois** |
|-------------|-----------|------------|
| **Código** | ~400 linhas | ~200 linhas |
| **Estilos** | CSS customizado completo | Apenas estilos específicos |
| **Reutilização** | Modal único | Componente reutilizável |
| **Manutenção** | Difícil de manter | Fácil de manter |
| **Consistência** | Visual único | Padronizado |
| **Funcionalidades** | Básicas | Avançadas (loading, tamanhos, etc.) |

## ✨ Benefícios da Refatoração

### 1. **Redução de Código**
- **Antes**: ~400 linhas de código
- **Depois**: ~200 linhas de código
- **Redução**: 50% menos código

### 2. **Manutenibilidade**
- **Antes**: Mudanças precisam ser feitas em cada modal
- **Depois**: Mudanças centralizadas no design system

### 3. **Consistência Visual**
- **Antes**: Cada modal pode ter aparência diferente
- **Depois**: Visual padronizado em toda a aplicação

### 4. **Funcionalidades Avançadas**
- **Antes**: Funcionalidades básicas
- **Depois**: Loading states, tamanhos variados, animações

### 5. **Acessibilidade**
- **Antes**: Precisa implementar manualmente
- **Depois**: Já implementado no design system

## 🎯 Passos para Refatoração

1. **Importar o componente modal**
2. **Remover template customizado**
3. **Configurar ModalConfig**
4. **Manter apenas estilos específicos**
5. **Testar funcionalidade**

## 🔧 Migração Gradual

Para migrar gradualmente:

1. **Identifique** modais similares
2. **Refatore** um modal por vez
3. **Teste** cada refatoração
4. **Documente** as mudanças
5. **Treine** a equipe no novo padrão

---

**Resultado**: Modais mais limpos, consistentes e fáceis de manter!
