import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalTemplateComponent, ModalAction } from './modal-template.component';

@Component({
  selector: 'app-modal-example',
  standalone: true,
  imports: [CommonModule, ModalTemplateComponent],
  template: `
    <app-modal-template
      title="Exemplo de Modal"
      [footerActions]="footerActions"
      (close)="onClose()">
      
      <!-- Conteúdo do Modal -->
      <div class="example-content">
        <div class="section">
          <h3>Seção 1 - Informações Básicas</h3>
          <p>Este é um exemplo de conteúdo que pode ser longo e precisar de scroll.</p>
          <div class="info-card">
            <strong>Nome:</strong> João Silva<br>
            <strong>Email:</strong> joao@exemplo.com<br>
            <strong>Telefone:</strong> (11) 99999-9999
          </div>
        </div>

        <div class="section">
          <h3>Seção 2 - Detalhes</h3>
          <p>Mais conteúdo para demonstrar o scroll...</p>
          <ul class="detail-list">
            <li>Item de detalhe 1</li>
            <li>Item de detalhe 2</li>
            <li>Item de detalhe 3</li>
            <li>Item de detalhe 4</li>
            <li>Item de detalhe 5</li>
          </ul>
        </div>

        <div class="section">
          <h3>Seção 3 - Configurações</h3>
          <p>Conteúdo adicional para demonstrar o comportamento do scroll...</p>
          <div class="config-grid">
            <div class="config-item">
              <label>Opção 1</label>
              <input type="checkbox" checked>
            </div>
            <div class="config-item">
              <label>Opção 2</label>
              <input type="checkbox">
            </div>
            <div class="config-item">
              <label>Opção 3</label>
              <input type="checkbox" checked>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>Seção 4 - Observações</h3>
          <p>Esta seção demonstra como o conteúdo pode ser extenso e ainda assim o header e footer permanecem fixos.</p>
          <textarea 
            placeholder="Digite suas observações aqui..."
            rows="4"
            class="observation-textarea">
          </textarea>
        </div>
      </div>
    </app-modal-template>
  `,
  styles: [`
    .example-content {
      color: #374151;
    }

    .section {
      margin-bottom: 32px;
    }

    .section:last-child {
      margin-bottom: 0;
    }

    .section h3 {
      margin: 0 0 16px 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #111827;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 8px;
    }

    .section p {
      margin: 0 0 16px 0;
      color: #6b7280;
      line-height: 1.6;
    }

    .info-card {
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      font-size: 0.9rem;
      line-height: 1.8;
    }

    .detail-list {
      margin: 0;
      padding-left: 20px;
      color: #6b7280;
    }

    .detail-list li {
      margin-bottom: 8px;
    }

    .config-grid {
      display: grid;
      gap: 12px;
    }

    .config-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background-color: #f9fafb;
      border-radius: 6px;
    }

    .config-item label {
      font-weight: 500;
      color: #374151;
    }

    .config-item input[type="checkbox"] {
      width: 16px;
      height: 16px;
    }

    .observation-textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.9rem;
      font-family: inherit;
      resize: vertical;
      min-height: 100px;
    }

    .observation-textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  `]
})
export class ModalExampleComponent {
  @Output() close = new EventEmitter<void>();

  footerActions: ModalAction[] = [
    {
      label: 'Cancelar',
      variant: 'ghost',
      onClick: () => this.onClose()
    },
    {
      label: 'Salvar',
      variant: 'primary',
      onClick: () => this.onSave()
    }
  ];

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    // Implementar lógica de salvamento
    console.log('Salvando...');
    this.onClose();
  }
}
