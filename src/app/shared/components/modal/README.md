# 📋 Padrão de Modais - Header e Footer Fixos

## 🎯 Visão Geral

Este padrão garante que todos os modais tenham header e footer fixos, com scroll apenas no conteúdo central.

## 📁 Arquivos

- **`MODAL_PATTERN.md`** - Documentação completa do padrão
- **`modal-template.component.ts`** - Componente template reutilizável
- **`modal-example.component.ts`** - Exemplo prático de uso
- **`modal.component.ts`** - Componente do design system

## 🚀 Uso Rápido

### 1. Usando o Template
```typescript
import { ModalTemplateComponent, ModalAction } from './modal-template.component';

@Component({
  template: `
    <app-modal-template
      title="Meu Modal"
      [footerActions]="footerActions"
      (close)="onClose()">
      
      <!-- Seu conteúdo aqui -->
      <div>Conteúdo do modal...</div>
    </app-modal-template>
  `
})
export class MeuModalComponent {
  footerActions: ModalAction[] = [
    { label: 'Cancelar', variant: 'ghost', onClick: () => this.onClose() },
    { label: 'Salvar', variant: 'primary', onClick: () => this.onSave() }
  ];
}
```

### 2. Implementação Manual
```html
<div class="modal-overlay" (click)="onClose()">
  <div class="modal-container" (click)="$event.stopPropagation()">
    <div class="modal-header">
      <h2 class="modal-title">Título</h2>
      <button class="modal-close" (click)="onClose()">×</button>
    </div>
    
    <div class="modal-body">
      <!-- Conteúdo com scroll -->
    </div>
    
    <div class="modal-footer">
      <!-- Botões fixos -->
    </div>
  </div>
</div>
```

## 🎨 CSS Essencial

```css
.modal-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  flex-shrink: 0;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
}

.modal-footer {
  flex-shrink: 0;
}
```

## ✅ Checklist

- [ ] `.modal-container` com `display: flex` e `flex-direction: column`
- [ ] `.modal-header` com `flex-shrink: 0`
- [ ] `.modal-body` com `flex: 1` e `overflow-y: auto`
- [ ] `.modal-footer` com `flex-shrink: 0`
- [ ] `overflow: hidden` no container

## 📚 Referências

- [Documentação Completa](./MODAL_PATTERN.md)
- [Template Reutilizável](./modal-template.component.ts)
- [Exemplo Prático](./modal-example.component.ts)
