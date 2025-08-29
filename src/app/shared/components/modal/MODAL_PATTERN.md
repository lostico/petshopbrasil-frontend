# 📋 Padrão de Modais - Header e Footer Fixos

Este documento descreve o padrão para criar modais com header e footer fixos, onde apenas o conteúdo central possui scroll.

## 🎯 Estrutura do Modal

### Template HTML
```html
<div class="modal-overlay" (click)="onClose()">
  <div class="modal-container" (click)="$event.stopPropagation()">
    <!-- Header Fixo -->
    <div class="modal-header">
      <h2 class="modal-title">Título do Modal</h2>
      <button class="modal-close" (click)="onClose()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <!-- Conteúdo com Scroll -->
    <div class="modal-body">
      <!-- Seu conteúdo aqui -->
    </div>

    <!-- Footer Fixo -->
    <div class="modal-footer">
      <app-button variant="ghost" label="Cancelar" (clicked)="onClose()"></app-button>
      <app-button variant="primary" label="Salvar" (clicked)="onSave()"></app-button>
    </div>
  </div>
</div>
```

## 🎨 CSS Essencial

### Estrutura Flexbox
```css
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
  overflow: hidden; /* Importante: esconde overflow do container */
}
```

### Header Fixo
```css
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 16px;
  flex-shrink: 0; /* Impede que o header encolha */
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
```

### Conteúdo com Scroll
```css
.modal-body {
  padding: 24px;
  flex: 1; /* Ocupa todo o espaço disponível */
  overflow-y: auto; /* Permite scroll vertical */
}
```

### Footer Fixo
```css
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
  flex-shrink: 0; /* Impede que o footer encolha */
}
```

## 🔧 Implementação Completa

### Exemplo de Componente
```typescript
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-example-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          <button class="modal-close" (click)="onClose()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Conteúdo -->
        <div class="modal-body">
          <div class="content-section">
            <h3>Seção 1</h3>
            <p>Conteúdo da primeira seção...</p>
          </div>
          
          <div class="content-section">
            <h3>Seção 2</h3>
            <p>Conteúdo da segunda seção...</p>
          </div>
          
          <!-- Adicione mais conteúdo conforme necessário -->
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <app-button 
            variant="ghost" 
            label="Cancelar" 
            (clicked)="onClose()">
          </app-button>
          <app-button 
            variant="primary" 
            label="Salvar" 
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

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 24px;
      border-top: 1px solid #e5e7eb;
      background-color: #f9fafb;
      flex-shrink: 0;
    }

    /* Estilos para o conteúdo */
    .content-section {
      margin-bottom: 24px;
    }

    .content-section h3 {
      margin: 0 0 12px 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #374151;
    }

    .content-section p {
      margin: 0;
      color: #6b7280;
      line-height: 1.6;
    }

    /* Responsividade */
    @media (max-width: 640px) {
      .modal-overlay {
        padding: 0.5rem;
      }

      .modal-container {
        width: 100%;
        max-width: 100%;
        max-height: 100vh;
      }

      .modal-header {
        padding: 1rem 1rem 0 1rem;
      }

      .modal-body {
        padding: 1rem;
      }

      .modal-footer {
        padding: 0.75rem 1rem 1rem 1rem;
        flex-direction: column;
      }

      .modal-footer app-button {
        width: 100%;
      }
    }
  `]
})
export class ExampleModalComponent {
  @Input() title = 'Título do Modal';
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    this.save.emit();
  }
}
```

## 📋 Checklist de Implementação

### ✅ Estrutura HTML
- [ ] `.modal-overlay` com `display: flex`
- [ ] `.modal-container` com `display: flex` e `flex-direction: column`
- [ ] `.modal-header` com `flex-shrink: 0`
- [ ] `.modal-body` com `flex: 1` e `overflow-y: auto`
- [ ] `.modal-footer` com `flex-shrink: 0`

### ✅ CSS Essencial
- [ ] `overflow: hidden` no `.modal-container`
- [ ] `flex-shrink: 0` no header e footer
- [ ] `flex: 1` no body
- [ ] `overflow-y: auto` no body

### ✅ Funcionalidades
- [ ] Fechar ao clicar no overlay
- [ ] Fechar ao clicar no botão X
- [ ] Prevenir fechamento ao clicar no conteúdo
- [ ] Botões de ação no footer

### ✅ Responsividade
- [ ] Padding reduzido em telas pequenas
- [ ] Footer em coluna em mobile
- [ ] Botões com largura total em mobile

## 🎨 Variações de Tamanho

### Modal Pequeno
```css
.modal-container {
  max-width: 400px;
}
```

### Modal Médio (padrão)
```css
.modal-container {
  max-width: 600px;
}
```

### Modal Grande
```css
.modal-container {
  max-width: 800px;
}
```

### Modal Extra Grande
```css
.modal-container {
  max-width: 1000px;
}
```

## 🔍 Exemplos de Uso

### Modal de Confirmação
```html
<div class="modal-body">
  <div class="confirmation-content">
    <div class="icon">⚠️</div>
    <h3>Tem certeza?</h3>
    <p>Esta ação não pode ser desfeita.</p>
  </div>
</div>
```

### Modal com Formulário
```html
<div class="modal-body">
  <form class="form-content">
    <div class="form-group">
      <label>Nome</label>
      <input type="text" class="form-input">
    </div>
    <div class="form-group">
      <label>Email</label>
      <input type="email" class="form-input">
    </div>
  </form>
</div>
```

### Modal com Lista
```html
<div class="modal-body">
  <div class="list-content">
    <div class="list-item">Item 1</div>
    <div class="list-item">Item 2</div>
    <div class="list-item">Item 3</div>
  </div>
</div>
```

## 🚀 Benefícios do Padrão

1. **UX Consistente**: Header e footer sempre visíveis
2. **Acessibilidade**: Botões de ação sempre acessíveis
3. **Responsividade**: Funciona bem em todos os dispositivos
4. **Performance**: Scroll apenas no conteúdo necessário
5. **Manutenibilidade**: Estrutura padronizada e reutilizável

## 📚 Referências

- [Modal de Detalhes do Tutor](../customer-detail-modal.component.ts)
- [Modal de Status de Clientes](../../customers/status-modal.component.ts)
- [Modal de Status de Pets](../../pets/pet-status-modal.component.ts)
- [Componente Modal do Design System](./modal.component.ts)
