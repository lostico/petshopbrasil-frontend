# Design System - PetShop Brasil

## 📋 Visão Geral

Este design system foi criado para garantir consistência visual e de experiência do usuário em todo o projeto PetShop Brasil. Ele é baseado no Tailwind CSS e utiliza componentes Angular standalone para máxima flexibilidade e reutilização.

## 🎯 Objetivos

- **Consistência**: Padronizar a aparência e comportamento dos componentes
- **Produtividade**: Acelerar o desenvolvimento com componentes reutilizáveis
- **Manutenibilidade**: Facilitar mudanças globais através de tokens centralizados
- **Acessibilidade**: Garantir que todos os componentes sigam as melhores práticas de acessibilidade
- **Responsividade**: Componentes que funcionam perfeitamente em todos os dispositivos

## 🏗️ Arquitetura

```
src/app/shared/
├── components/          # Componentes reutilizáveis
│   ├── button/
│   ├── input/
│   ├── card/
│   ├── badge/
│   ├── alert/
│   ├── modal/
│   └── index.ts
├── tokens/             # Tokens de design
│   └── design-tokens.ts
└── utils/              # Utilitários
    └── class-utils.ts
```

## 🎨 Tokens de Design

### Cores

O sistema utiliza uma paleta de cores consistente com variações para diferentes estados:

```typescript
// Cores Primárias
primary: {
  50: '#eff6ff',   // Muito claro
  500: '#3b82f6',  // Principal
  900: '#1e3a8a',  // Muito escuro
}

// Cores de Status
success: { 500: '#22c55e' }  // Verde
warning: { 500: '#f59e0b' }  // Amarelo
danger: { 500: '#ef4444' }   // Vermelho
```

### Tipografia

```typescript
// Famílias de Fontes
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  display: ['Poppins', 'system-ui', 'sans-serif'],
}

// Tamanhos
fontSize: {
  sm: ['0.875rem', { lineHeight: '1.25rem' }],
  base: ['1rem', { lineHeight: '1.5rem' }],
  lg: ['1.125rem', { lineHeight: '1.75rem' }],
}
```

### Espaçamentos

```typescript
spacing: {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
}
```

## 🧩 Componentes

### Button

Componente de botão com múltiplas variantes e estados.

```typescript
import { ButtonComponent } from '@shared/components';

// Uso básico
<app-button label="Salvar" variant="primary" (clicked)="onSave()"></app-button>

// Com ícone
<app-button 
  label="Adicionar" 
  icon="plus" 
  variant="primary" 
  size="lg">
</app-button>

// Estados
<app-button 
  label="Carregando..." 
  loading="true" 
  disabled="true">
</app-button>
```

**Variantes**: `primary`, `secondary`, `outline`, `ghost`, `danger`
**Tamanhos**: `sm`, `md`, `lg`
**Ícones**: `plus`, `edit`, `trash`, `arrow-left`, `arrow-right`, `check`, `x`

### Input

Componente de input com validação e ícones.

```typescript
import { InputComponent } from '@shared/components';

// Uso básico
<app-input 
  label="Email" 
  type="email" 
  placeholder="seu@email.com"
  [(ngModel)]="email">
</app-input>

// Com ícone e validação
<app-input 
  label="Telefone" 
  type="tel" 
  leftIcon="phone"
  [valid]="isValid"
  [invalid]="hasError"
  errorMessage="Telefone inválido">
</app-input>
```

**Tipos**: `text`, `email`, `password`, `number`, `tel`, `url`, `search`
**Tamanhos**: `sm`, `md`, `lg`
**Ícones**: `search`, `mail`, `phone`, `user`, `eye`, `eye-off`, `check`, `x`

### Card

Componente de card para organizar conteúdo.

```typescript
import { CardComponent } from '@shared/components';

// Card básico
<app-card title="Título do Card" subtitle="Subtítulo">
  <p>Conteúdo do card</p>
</app-card>

// Com ações no header
<app-card 
  title="Lista de Clientes" 
  [headerActions]="true"
  variant="elevated">
  
  <div card-actions>
    <app-button label="Adicionar" icon="plus" size="sm"></app-button>
  </div>
  
  <p>Lista de clientes...</p>
</app-card>
```

**Variantes**: `default`, `elevated`, `outlined`, `flat`

### Badge

Componente para status e labels.

```typescript
import { BadgeComponent } from '@shared/components';

// Badge básico
<app-badge text="Ativo" variant="success"></app-badge>

// Com ícone
<app-badge 
  text="Em andamento" 
  icon="clock" 
  variant="warning"
  outlined="true">
</app-badge>
```

**Variantes**: `primary`, `secondary`, `success`, `warning`, `danger`, `info`
**Tamanhos**: `sm`, `md`, `lg`

### Alert

Componente para mensagens de feedback.

```typescript
import { AlertComponent } from '@shared/components';

// Alerta de sucesso
<app-alert 
  variant="success"
  title="Sucesso!"
  message="Operação realizada com sucesso."
  [dismissible]="true"
  (closed)="onAlertClose()">
</app-alert>

// Alerta de erro
<app-alert 
  variant="danger"
  title="Erro"
  message="Ocorreu um erro ao processar sua solicitação.">
</app-alert>
```

**Variantes**: `success`, `warning`, `danger`, `info`
**Tamanhos**: `sm`, `md`, `lg`

### Modal

Componente de modal reutilizável e padronizado.

```typescript
import { ModalComponent, ModalConfig } from '@shared/components';

// Modal básico
<app-modal 
  [config]="modalConfig"
  [isOpen]="showModal"
  (close)="onCloseModal()"
>
  <p>Conteúdo do modal aqui...</p>
</app-modal>

// Configuração do modal
const modalConfig: ModalConfig = {
  title: 'Título do Modal',
  size: 'md',
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

**Tamanhos**: `sm`, `md`, `lg`, `xl`, `full`
**Variantes de Botão**: `primary`, `secondary`, `danger`, `outline`, `ghost`

## 🛠️ Utilitários

### Class Utils

Utilitários para gerenciamento de classes CSS.

```typescript
import { classNames, variantClasses, stateClasses } from '@shared/utils/class-utils';

// Combinação de classes
const classes = classNames(
  'base-class',
  { 'conditional-class': condition },
  ['array-classes']
);

// Classes de variante
const buttonClasses = variantClasses(
  'btn-base',
  {
    primary: 'btn-primary',
    secondary: 'btn-secondary'
  },
  'primary'
);

// Classes de estado
const inputClasses = stateClasses('input-base', {
  disabled: true,
  focused: false,
  loading: false
});
```

## 📱 Responsividade

Todos os componentes são responsivos por padrão, utilizando os breakpoints do Tailwind:

- `xs`: 475px
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px
- `3xl`: 1600px

## ♿ Acessibilidade

O design system segue as melhores práticas de acessibilidade:

- **ARIA Labels**: Todos os componentes incluem labels apropriados
- **Focus Management**: Estados de foco visíveis e navegáveis
- **Keyboard Navigation**: Suporte completo para navegação por teclado
- **Screen Readers**: Estrutura semântica adequada
- **Color Contrast**: Contraste de cores adequado (WCAG AA)

## 🎨 Temas

O sistema suporta temas através de variáveis CSS:

```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
}
```

## 📋 Checklist de Implementação

Antes de usar um componente, verifique:

- [ ] O componente está importado corretamente
- [ ] As props obrigatórias estão definidas
- [ ] Os eventos estão sendo tratados
- [ ] O componente é responsivo
- [ ] A acessibilidade está adequada
- [ ] O tema está sendo aplicado corretamente

## 🔄 Migração

Para migrar componentes existentes para o design system:

1. **Identifique** o componente a ser migrado
2. **Analise** as funcionalidades necessárias
3. **Substitua** pelo componente do design system
4. **Teste** a funcionalidade e aparência
5. **Remova** o código CSS customizado desnecessário

## 📚 Recursos Adicionais

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Angular Component Architecture](https://angular.io/guide/component-overview)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design Principles](https://material.io/design)

## 🤝 Contribuição

Para contribuir com o design system:

1. **Discuta** a mudança com a equipe
2. **Documente** as alterações
3. **Teste** em diferentes cenários
4. **Mantenha** a consistência com o sistema existente
5. **Atualize** esta documentação

---

**Lembre-se**: O design system é um produto vivo que evolui com o projeto. Mantenha-o atualizado e consistente!

