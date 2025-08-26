# Componente Modal - Design System

## 📋 Visão Geral

O componente `ModalComponent` é um modal reutilizável e padronizado do design system que oferece flexibilidade e consistência visual em toda a aplicação.

## 🚀 Como Usar

### Importação

```typescript
import { ModalComponent, ModalConfig, ModalAction } from '@shared/components';
```

### Uso Básico

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ModalComponent],
  template: `
    <app-modal 
      [config]="modalConfig"
      [isOpen]="showModal"
      (close)="onCloseModal()"
    >
      <p>Conteúdo do modal aqui...</p>
    </app-modal>
  `
})
export class ExampleComponent {
  showModal = false;
  
  modalConfig: ModalConfig = {
    title: 'Título do Modal',
    size: 'md',
    showCloseButton: true,
    closeOnOverlayClick: true,
    showFooter: true,
    footerActions: [
      {
        label: 'Cancelar',
        variant: 'secondary',
        onClick: () => this.onCloseModal()
      },
      {
        label: 'Salvar',
        variant: 'primary',
        onClick: () => this.onSave()
      }
    ]
  };

  onCloseModal(): void {
    this.showModal = false;
  }

  onSave(): void {
    // Lógica de salvamento
    this.onCloseModal();
  }
}
```

## ⚙️ Configuração

### ModalConfig

```typescript
interface ModalConfig {
  title?: string;                    // Título do modal
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';  // Tamanho do modal
  showCloseButton?: boolean;         // Mostrar botão de fechar (padrão: true)
  closeOnOverlayClick?: boolean;     // Fechar ao clicar no overlay (padrão: true)
  showFooter?: boolean;              // Mostrar footer com ações (padrão: false)
  footerActions?: ModalAction[];     // Ações do footer
}
```

### ModalAction

```typescript
interface ModalAction {
  label: string;                     // Texto do botão
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';         // Tamanho do botão
  disabled?: boolean;                // Botão desabilitado
  loading?: boolean;                 // Estado de carregamento
  onClick: () => void;               // Função de callback
}
```

## 📏 Tamanhos Disponíveis

- **sm**: 400px (pequeno)
- **md**: 600px (médio - padrão)
- **lg**: 800px (grande)
- **xl**: 1024px (extra grande)
- **full**: 95% da viewport (tela cheia)

## 🎨 Variantes de Botão

- **primary**: Azul (ação principal)
- **secondary**: Cinza (ação secundária)
- **danger**: Vermelho (ação perigosa)
- **outline**: Contorno azul
- **ghost**: Transparente

## 💡 Exemplos Práticos

### Modal de Confirmação

```typescript
modalConfig: ModalConfig = {
  title: 'Confirmar Exclusão',
  size: 'sm',
  showFooter: true,
  footerActions: [
    {
      label: 'Cancelar',
      variant: 'secondary',
      onClick: () => this.onCancel()
    },
    {
      label: 'Excluir',
      variant: 'danger',
      onClick: () => this.onDelete()
    }
  ]
};
```

### Modal de Formulário

```typescript
modalConfig: ModalConfig = {
  title: 'Editar Cliente',
  size: 'lg',
  showFooter: true,
  footerActions: [
    {
      label: 'Cancelar',
      variant: 'ghost',
      onClick: () => this.onCancel()
    },
    {
      label: 'Salvar',
      variant: 'primary',
      loading: this.isSaving,
      disabled: !this.form.valid,
      onClick: () => this.onSave()
    }
  ]
};
```

### Modal Simples (Sem Footer)

```typescript
modalConfig: ModalConfig = {
  title: 'Informações',
  size: 'md',
  showFooter: false
};
```

### Modal de Tela Cheia

```typescript
modalConfig: ModalConfig = {
  title: 'Visualizar Detalhes',
  size: 'full',
  showFooter: true,
  footerActions: [
    {
      label: 'Fechar',
      variant: 'primary',
      onClick: () => this.onClose()
    }
  ]
};
```

## 🔄 Migração de Modais Existentes

Para migrar modais existentes para o design system:

### Antes (Modal Customizado)
```typescript
// Template
<div class="modal-overlay" (click)="onClose()">
  <div class="modal-content" (click)="$event.stopPropagation()">
    <div class="modal-header">
      <h2>{{ title }}</h2>
      <button class="btn-close" (click)="onClose()">×</button>
    </div>
    <div class="modal-body">
      <!-- Conteúdo -->
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" (click)="onCancel()">Cancelar</button>
      <button class="btn-primary" (click)="onSave()">Salvar</button>
    </div>
  </div>
</div>
```

### Depois (Design System)
```typescript
// Template
<app-modal 
  [config]="modalConfig"
  [isOpen]="isOpen"
  (close)="onClose()"
>
  <!-- Conteúdo -->
</app-modal>

// Componente
modalConfig: ModalConfig = {
  title: this.title,
  showFooter: true,
  footerActions: [
    {
      label: 'Cancelar',
      variant: 'secondary',
      onClick: () => this.onCancel()
    },
    {
      label: 'Salvar',
      variant: 'primary',
      onClick: () => this.onSave()
    }
  ]
};
```

## ✨ Benefícios

- **Consistência**: Visual padronizado em toda a aplicação
- **Reutilização**: Um componente para todos os modais
- **Manutenibilidade**: Mudanças centralizadas
- **Acessibilidade**: Segue as melhores práticas
- **Responsividade**: Funciona em todos os dispositivos
- **Flexibilidade**: Configuração via props

## 🎯 Boas Práticas

1. **Use títulos descritivos** que expliquem o propósito do modal
2. **Escolha o tamanho adequado** para o conteúdo
3. **Organize as ações** no footer de forma lógica (cancelar à esquerda, confirmar à direita)
4. **Use variantes apropriadas** para os botões (danger para ações destrutivas)
5. **Implemente estados de loading** para ações assíncronas
6. **Valide formulários** antes de habilitar botões de confirmação

## 🔧 Customização

O componente utiliza as classes CSS do design system definidas em `src/styles/components.css`. Para customizações específicas, você pode:

1. **Estender as classes CSS** existentes
2. **Usar CSS customizado** no componente pai
3. **Modificar os tokens** de design no arquivo de configuração

---

**Lembre-se**: O componente modal é parte do design system e deve manter a consistência visual em toda a aplicação!
