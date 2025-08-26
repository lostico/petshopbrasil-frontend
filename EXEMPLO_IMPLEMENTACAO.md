# Guia de Implementação do Design System

## 🚀 Como Implementar o Design System

Este guia mostra como implementar o design system em componentes existentes do projeto.

## 📋 Pré-requisitos

1. **Importar os componentes** no seu módulo/componente
2. **Substituir elementos HTML** pelos componentes do design system
3. **Remover CSS customizado** desnecessário
4. **Testar** a funcionalidade e aparência

## 🔄 Exemplo de Migração

### Antes (Componente Original)

```typescript
// customer-form.component.ts
@Component({
  selector: 'app-customer-form',
  template: `
    <div class="form-container">
      <div class="header">
        <h1>{{ isEditMode ? 'Editar Cliente' : 'Novo Cliente' }}</h1>
        <button class="btn-secondary" (click)="onCancel()">
          <svg>...</svg>
          Voltar
        </button>
      </div>

      <div *ngIf="success" class="success-message">
        <svg>...</svg>
        {{ successMessage }}
      </div>

      <form [formGroup]="customerForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Nome Completo *</label>
          <input 
            type="text" 
            id="name"
            formControlName="name"
            placeholder="Digite o nome completo"
            [class.invalid]="isFieldInvalid('name')"
          >
          <span class="error-text" *ngIf="getFieldError('name')">
            {{ getFieldError('name') }}
          </span>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ isEditMode ? 'Atualizar' : 'Cadastrar' }}
          </button>
          <button type="button" class="btn-secondary" (click)="onCancel()">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./customer-form.component.css']
})
```

### Depois (Com Design System)

```typescript
// customer-form.component.ts
import { 
  ButtonComponent, 
  InputComponent, 
  CardComponent, 
  AlertComponent 
} from '@shared/components';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    CardComponent,
    AlertComponent
  ],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-secondary-900">
            {{ isEditMode ? 'Editar Cliente' : 'Novo Cliente' }}
          </h1>
          <p class="text-secondary-600 mt-1">
            {{ isEditMode ? 'Edite os dados do cliente' : 'Cadastre um novo cliente na sua clínica' }}
          </p>
        </div>
        
        <app-button 
          label="Voltar" 
          icon="arrow-left" 
          variant="secondary"
          (clicked)="onCancel()">
        </app-button>
      </div>

      <!-- Success Alert -->
      <app-alert
        *ngIf="success"
        variant="success"
        title="Sucesso!"
        [message]="successMessage"
        [dismissible]="true"
        (closed)="onAlertClose()">
      </app-alert>

      <!-- Form Card -->
      <app-card title="Informações do Cliente" variant="elevated">
        <form [formGroup]="customerForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <app-input 
              label="Nome Completo" 
              placeholder="Digite o nome completo"
              formControlName="name"
              [invalid]="isFieldInvalid('name')"
              [errorMessage]="getFieldError('name')">
            </app-input>

            <app-input 
              label="CPF" 
              placeholder="000.000.000-00"
              formControlName="cpf"
              [invalid]="isFieldInvalid('cpf')"
              [errorMessage]="getFieldError('cpf')">
            </app-input>

            <app-input 
              label="Email" 
              type="email" 
              leftIcon="mail"
              placeholder="email@exemplo.com"
              formControlName="email"
              [invalid]="isFieldInvalid('email')"
              [errorMessage]="getFieldError('email')">
            </app-input>

            <app-input 
              label="Telefone" 
              type="tel" 
              leftIcon="phone"
              placeholder="(00) 00000-0000"
              formControlName="phone"
              [invalid]="isFieldInvalid('phone')"
              [errorMessage]="getFieldError('phone')">
            </app-input>
          </div>

          <div class="flex gap-4 pt-4">
            <app-button 
              type="submit" 
              [label]="isEditMode ? 'Atualizar' : 'Cadastrar'"
              icon="check"
              variant="primary"
              [loading]="loading"
              [disabled]="loading">
            </app-button>
            
            <app-button 
              type="button" 
              label="Cancelar" 
              variant="secondary"
              (clicked)="onCancel()">
            </app-button>
          </div>
        </form>
      </app-card>
    </div>
  `,
  styles: [] // Sem CSS customizado!
})
```

## 🎯 Benefícios da Migração

### ✅ Antes
- CSS customizado extenso (266 linhas)
- Classes CSS duplicadas
- Inconsistência visual
- Difícil manutenção
- Responsividade manual

### ✅ Depois
- Zero CSS customizado
- Componentes reutilizáveis
- Consistência garantida
- Manutenção centralizada
- Responsividade automática

## 📊 Comparação de Código

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Linhas de CSS** | 266 | 0 |
| **Componentes** | HTML puro | Design System |
| **Responsividade** | Manual | Automática |
| **Acessibilidade** | Básica | Completa |
| **Manutenção** | Difícil | Fácil |

## 🔧 Passos para Migração

### 1. **Analisar o Componente**
```bash
# Identificar elementos a serem migrados
- Botões → app-button
- Inputs → app-input  
- Mensagens → app-alert
- Containers → app-card
```

### 2. **Importar Componentes**
```typescript
import { 
  ButtonComponent, 
  InputComponent, 
  CardComponent, 
  AlertComponent 
} from '@shared/components';
```

### 3. **Substituir Elementos**
```html
<!-- Antes -->
<button class="btn-primary">Salvar</button>

<!-- Depois -->
<app-button label="Salvar" variant="primary"></app-button>
```

### 4. **Remover CSS**
```css
/* Remover todo CSS customizado desnecessário */
.btn-primary { /* ❌ Remover */ }
.form-group { /* ❌ Remover */ }
```

### 5. **Testar**
- ✅ Funcionalidade preservada
- ✅ Aparência consistente
- ✅ Responsividade funcionando
- ✅ Acessibilidade adequada

## 🎨 Exemplos de Uso

### Botões
```html
<!-- Primário -->
<app-button label="Salvar" variant="primary" (clicked)="onSave()"></app-button>

<!-- Com ícone -->
<app-button 
  label="Adicionar" 
  icon="plus" 
  variant="primary" 
  size="lg">
</app-button>

<!-- Estados -->
<app-button 
  label="Carregando..." 
  [loading]="true" 
  [disabled]="true">
</app-button>
```

### Inputs
```html
<!-- Básico -->
<app-input 
  label="Nome" 
  placeholder="Digite seu nome"
  [(ngModel)]="name">
</app-input>

<!-- Com validação -->
<app-input 
  label="Email" 
  type="email" 
  leftIcon="mail"
  [invalid]="hasError"
  errorMessage="Email inválido">
</app-input>
```

### Alertas
```html
<!-- Sucesso -->
<app-alert
  variant="success"
  title="Sucesso!"
  message="Operação realizada com sucesso."
  [dismissible]="true">
</app-alert>

<!-- Erro -->
<app-alert
  variant="danger"
  title="Erro"
  message="Ocorreu um erro ao processar sua solicitação.">
</app-alert>
```

### Cards
```html
<!-- Básico -->
<app-card title="Título" subtitle="Subtítulo">
  <p>Conteúdo do card</p>
</app-card>

<!-- Com ações -->
<app-card 
  title="Lista" 
  [headerActions]="true"
  variant="elevated">
  
  <div card-actions>
    <app-button label="Adicionar" icon="plus" size="sm"></app-button>
  </div>
  
  <p>Conteúdo...</p>
</app-card>
```

## 🚨 Pontos de Atenção

### 1. **Formulários Reativos**
```typescript
// Usar formControlName em vez de [(ngModel)]
<app-input 
  label="Nome" 
  formControlName="name"
  [invalid]="form.get('name')?.invalid">
</app-input>
```

### 2. **Eventos**
```typescript
// Usar (clicked) em vez de (click)
<app-button 
  label="Salvar" 
  (clicked)="onSave($event)">
</app-button>
```

### 3. **Validação**
```typescript
// Passar estado de validação explicitamente
<app-input 
  [invalid]="isFieldInvalid('email')"
  [errorMessage]="getFieldError('email')">
</app-input>
```

## 📈 Métricas de Sucesso

Após a migração, você deve observar:

- **Redução de 80-90%** no CSS customizado
- **Consistência visual** em toda a aplicação
- **Melhor performance** (menos CSS para carregar)
- **Desenvolvimento mais rápido** (componentes prontos)
- **Manutenção simplificada** (mudanças centralizadas)

## 🎯 Próximos Passos

1. **Migrar componentes críticos** primeiro
2. **Testar em diferentes dispositivos**
3. **Validar acessibilidade**
4. **Documentar padrões específicos**
5. **Treinar a equipe** no uso do design system

---

**Dica**: Comece com componentes simples e vá evoluindo para os mais complexos. O design system é uma jornada, não um destino!

