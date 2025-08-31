# Design System - PetShop Brasil Frontend

## Visão Geral

Este documento descreve os padrões de design, componentes e diretrizes utilizados no projeto PetShop Brasil Frontend.

## Componentes

### Cards

#### Espaçamento Entre Cards

Para garantir espaçamento adequado entre cards, especialmente quando há cards condicionais (`*ngIf`), use a seguinte estrutura:

```html
<!-- ✅ Estrutura Correta -->
<div class="space-y-6">
  <div>
    <app-card>
      <!-- Conteúdo do card -->
    </app-card>
  </div>
  <div *ngIf="condicao">
    <app-card>
      <!-- Conteúdo do card condicional -->
    </app-card>
  </div>
</div>
```

**Por que usar essa estrutura:**
- O `space-y-6` do Tailwind CSS aplica `margin-top: 1.5rem` a todos os elementos filhos diretos (exceto o primeiro)
- Cada card envolvido em uma `div` garante que o espaçamento seja aplicado corretamente
- Funciona mesmo quando alguns cards são condicionais
- Mantém consistência visual em todo o projeto

**Alternativas de espaçamento:**
- `space-y-4`: 1rem (16px) - Espaçamento menor
- `space-y-6`: 1.5rem (24px) - Espaçamento padrão
- `space-y-8`: 2rem (32px) - Espaçamento maior

#### Exemplo de Implementação

```html
<!-- Service Form -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <!-- Coluna Esquerda -->
  <div class="space-y-6">
    <div>
      <app-card>
        <!-- Formulário básico -->
      </app-card>
    </div>
  </div>

  <!-- Coluna Direita -->
  <div class="space-y-6">
    <div>
      <app-card>
        <!-- Preço e duração -->
      </app-card>
    </div>
    <div *ngIf="isEditMode && service">
      <app-card>
        <!-- Informações adicionais -->
      </app-card>
    </div>
  </div>
</div>
```

### Input

### Textarea

Componente de textarea reutilizável do design system.

#### Características

- **ControlValueAccessor**: Compatível com Reactive Forms
- **Estados visuais**: Normal, foco, erro, sucesso e desabilitado
- **Contador de caracteres**: Opcional com limite configurável
- **Tamanhos**: sm, md, lg
- **Responsivo**: Adaptável a diferentes tamanhos de tela
- **Acessível**: Suporte a labels, aria-labels e navegação por teclado

#### Uso Básico

```html
<app-textarea
  id="description"
  label="Descrição"
  placeholder="Digite sua descrição..."
  formControlName="description">
</app-textarea>
```

#### Propriedades

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `id` | string | '' | ID único do textarea |
| `label` | string | '' | Label do campo |
| `placeholder` | string | '' | Texto de placeholder |
| `size` | TextareaSize | 'md' | Tamanho do textarea (sm, md, lg) |
| `rows` | number | 4 | Número de linhas visíveis |
| `disabled` | boolean | false | Se o campo está desabilitado |
| `readonly` | boolean | false | Se o campo é somente leitura |
| `required` | boolean | false | Se o campo é obrigatório |
| `maxlength` | number | undefined | Limite máximo de caracteres |
| `minlength` | number | undefined | Limite mínimo de caracteres |
| `showCharacterCounter` | boolean | false | Mostrar contador de caracteres |
| `helperText` | string | '' | Texto de ajuda |
| `errorMessage` | string | '' | Mensagem de erro |
| `valid` | boolean | false | Estado de sucesso |
| `invalid` | boolean | false | Estado de erro |
| `noResize` | boolean | false | Desabilitar redimensionamento |

#### Exemplos

**Com contador de caracteres:**
```html
<app-textarea
  id="description"
  label="Descrição"
  placeholder="Digite sua descrição..."
  [maxlength]="500"
  [showCharacterCounter]="true"
  formControlName="description">
</app-textarea>
```

**Com validação e mensagem de erro:**
```html
<app-textarea
  id="description"
  label="Descrição"
  placeholder="Digite sua descrição..."
  formControlName="description"
  [invalid]="description?.invalid && description?.touched"
  [errorMessage]="description?.errors?.['required'] ? 'Descrição é obrigatória' : ''">
</app-textarea>
```

### Button

### Select

### Alert

### Modal

### Badge

## Cores

### Paleta Principal

- **Primary**: Azul (#3B82F6)
- **Secondary**: Cinza (#6B7280)
- **Success**: Verde (#22C55E)
- **Warning**: Amarelo (#F59E0B)
- **Danger**: Vermelho (#EF4444)

### Paleta de Cinzas

- **50**: #F9FAFB
- **100**: #F3F4F6
- **200**: #E5E7EB
- **300**: #D1D5DB
- **400**: #9CA3AF
- **500**: #6B7280
- **600**: #4B5563
- **700**: #374151
- **800**: #1F2937
- **900**: #111827

## Tipografia

### Hierarquia

- **H1**: `text-3xl font-bold` (30px)
- **H2**: `text-2xl font-semibold` (24px)
- **H3**: `text-xl font-semibold` (20px)
- **H4**: `text-lg font-medium` (18px)
- **Body**: `text-sm` (14px)
- **Small**: `text-xs` (12px)

### Pesos

- **Light**: `font-light`
- **Normal**: `font-normal`
- **Medium**: `font-medium`
- **Semibold**: `font-semibold`
- **Bold**: `font-bold`

## Espaçamento

### Sistema de Spacing

Baseado no Tailwind CSS com incrementos de 4px:

- **0**: 0px
- **1**: 4px
- **2**: 8px
- **3**: 12px
- **4**: 16px
- **5**: 20px
- **6**: 24px
- **8**: 32px
- **10**: 40px
- **12**: 48px
- **16**: 64px
- **20**: 80px

### Uso Recomendado

- **Espaçamento interno de componentes**: `p-4` ou `p-5`
- **Espaçamento entre elementos**: `space-y-4` ou `space-y-6`
- **Espaçamento entre seções**: `space-y-8` ou `space-y-10`
- **Margens laterais**: `mx-4` ou `mx-6`

## Grid System

### Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Layouts Comuns

**Formulário de duas colunas:**
```html
<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <!-- Coluna esquerda -->
  <div class="space-y-6">
    <!-- Cards -->
  </div>
  
  <!-- Coluna direita -->
  <div class="space-y-6">
    <!-- Cards -->
  </div>
</div>
```

**Layout de três colunas:**
```html
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <!-- Coluna principal -->
  <div class="lg:col-span-2 space-y-6">
    <!-- Cards principais -->
  </div>
  
  <!-- Sidebar -->
  <div class="space-y-6">
    <!-- Cards da sidebar -->
  </div>
</div>
```

## Estados e Interações

### Estados de Formulário

- **Normal**: Borda cinza, sem sombra
- **Foco**: Borda azul, sombra azul suave
- **Erro**: Borda vermelha, sombra vermelha suave
- **Sucesso**: Borda verde, sombra verde suave
- **Desabilitado**: Fundo cinza claro, texto cinza

### Transições

- **Duração padrão**: `duration-200` (200ms)
- **Easing**: `ease-in-out`
- **Propriedades**: `transition-all`

## Acessibilidade

### Diretrizes

- Use `aria-label` para elementos sem texto visível
- Mantenha contraste adequado (mínimo 4.5:1)
- Suporte navegação por teclado
- Use `focus-visible` para indicadores de foco
- Implemente `ControlValueAccessor` em componentes de formulário

### Exemplos

```html
<!-- Botão com aria-label -->
<button aria-label="Fechar modal" class="...">
  <svg>...</svg>
</button>

<!-- Input com label associado -->
<label for="email">Email</label>
<input id="email" type="email" aria-describedby="email-help">
<div id="email-help">Digite seu endereço de email</div>
```

## Responsividade

### Abordagem Mobile-First

- Comece com estilos para mobile
- Use breakpoints para adicionar estilos para telas maiores
- Teste em diferentes tamanhos de tela

### Padrões Comuns

```html
<!-- Grid responsivo -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">

<!-- Espaçamento responsivo -->
<div class="p-4 md:p-6 lg:p-8">

<!-- Texto responsivo -->
<h1 class="text-2xl md:text-3xl lg:text-4xl">
```

## Performance

### Otimizações

- Use `trackBy` em `*ngFor` para melhor performance
- Implemente `OnPush` change detection quando apropriado
- Lazy load de componentes pesados
- Use `async` pipe para observables

### Exemplos

```typescript
// trackBy function
trackByFn(index: number, item: any): any {
  return item.id;
}

// OnPush change detection
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

## Convenções de Nomenclatura

### Classes CSS

- Use classes utilitárias do Tailwind quando possível
- Para classes customizadas, use kebab-case
- Mantenha consistência na nomenclatura

### Componentes

- Use PascalCase para nomes de componentes
- Prefixo `app-` para componentes do design system
- Nomes descritivos e claros

### Variáveis

- Use camelCase para variáveis TypeScript
- Nomes descritivos que indicam o propósito
- Evite abreviações confusas

## Manutenção

### Atualizações

- Mantenha a documentação atualizada
- Teste componentes após mudanças
- Use versionamento semântico
- Documente breaking changes

### Revisão de Código

- Verifique aderência aos padrões
- Teste responsividade
- Valide acessibilidade
- Confirme performance

---

*Este documento deve ser mantido atualizado conforme o design system evolui.*

