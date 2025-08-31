# Diretrizes de Layout e Espaçamento

## Visão Geral

Este documento descreve as melhores práticas para layout e espaçamento no projeto PetShop Brasil Frontend, garantindo consistência visual e experiência do usuário.

## Espaçamento Entre Cards

### Problema Comum

Quando cards são renderizados condicionalmente (`*ngIf`), o espaçamento pode não funcionar corretamente com classes como `space-y-*` do Tailwind CSS.

### Solução Padrão

Use a seguinte estrutura para garantir espaçamento consistente entre cards:

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

### Por que Funciona

1. **Elementos filhos diretos**: O `space-y-6` aplica `margin-top` apenas aos elementos filhos diretos
2. **Cards envolvidos**: Cada `app-card` fica em uma `div` separada
3. **Condicionais**: Funciona mesmo quando alguns cards são condicionais
4. **Consistência**: Mantém espaçamento uniforme em todo o projeto

### Opções de Espaçamento

| Classe | Espaçamento | Uso Recomendado |
|--------|-------------|-----------------|
| `space-y-4` | 1rem (16px) | Elementos relacionados |
| `space-y-6` | 1.5rem (24px) | **Padrão para cards** |
| `space-y-8` | 2rem (32px) | Seções diferentes |

## Layouts Comuns

### Formulário de Duas Colunas

```html
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

### Layout de Três Colunas (Principal + Sidebar)

```html
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <!-- Coluna Principal -->
  <div class="lg:col-span-2 space-y-6">
    <div>
      <app-card>
        <!-- Conteúdo principal -->
      </app-card>
    </div>
    <div>
      <app-card>
        <!-- Conteúdo secundário -->
      </app-card>
    </div>
  </div>

  <!-- Sidebar -->
  <div class="space-y-6">
    <div>
      <app-card>
        <!-- Informações do sistema -->
      </app-card>
    </div>
    <div>
      <app-card>
        <!-- Ações rápidas -->
      </app-card>
    </div>
  </div>
</div>
```

### Lista com Filtros

```html
<!-- Filtros -->
<div class="mb-6">
  <app-card>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Campos de filtro -->
    </div>
  </app-card>
</div>

<!-- Lista -->
<app-card>
  <div class="overflow-x-auto">
    <!-- Tabela ou lista -->
  </div>
</app-card>
```

## Grid System

### Breakpoints

| Breakpoint | Tamanho | Uso |
|------------|---------|-----|
| `sm` | 640px | Tablets pequenos |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktops pequenos |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Desktops grandes |

### Classes de Grid

```html
<!-- Grid responsivo -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">

<!-- Grid com span -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div class="lg:col-span-2">
    <!-- Ocupa 2/3 da largura -->
  </div>
  <div>
    <!-- Ocupa 1/3 da largura -->
  </div>
</div>
```

## Espaçamento Interno

### Cards

```html
<!-- Padding padrão -->
<app-card>
  <div class="space-y-4">
    <!-- Conteúdo com espaçamento interno -->
  </div>
</app-card>

<!-- Padding customizado -->
<app-card padding="p-6">
  <div class="space-y-6">
    <!-- Conteúdo com mais espaçamento -->
  </div>
</app-card>
```

### Formulários

```html
<!-- Campos de formulário -->
<div class="space-y-4">
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Nome do Campo
    </label>
    <app-input class="w-full">
    </app-input>
  </div>
  
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Outro Campo
    </label>
    <app-textarea class="w-full">
    </app-textarea>
  </div>
</div>
```

## Margens e Padding

### Sistema de Spacing

Baseado no Tailwind CSS (incrementos de 4px):

| Classe | Tamanho | Uso |
|--------|---------|-----|
| `p-4` | 1rem | Padding interno padrão |
| `p-5` | 1.25rem | Padding interno maior |
| `m-4` | 1rem | Margem externa |
| `mx-4` | 1rem | Margem horizontal |
| `my-6` | 1.5rem | Margem vertical |

### Uso Recomendado

```html
<!-- Container principal -->
<div class="container mx-auto px-4 py-6">

<!-- Seção com margem -->
<section class="mb-8">

<!-- Card com padding -->
<div class="p-4 md:p-6">

<!-- Espaçamento entre elementos -->
<div class="space-y-4">
```

## Responsividade

### Abordagem Mobile-First

```html
<!-- Comece com mobile, adicione para telas maiores -->
<div class="p-4 md:p-6 lg:p-8">
<div class="text-sm md:text-base lg:text-lg">
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### Exemplos Práticos

```html
<!-- Header responsivo -->
<header class="p-4 md:p-6">
  <div class="flex flex-col md:flex-row md:items-center md:justify-between">
    <h1 class="text-2xl md:text-3xl font-bold">Título</h1>
    <div class="mt-4 md:mt-0">
      <app-button>Botão</app-button>
    </div>
  </div>
</header>

<!-- Grid responsivo -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
  <!-- Cards -->
</div>
```

## Estados e Interações

### Loading States

```html
<!-- Loading com espaçamento adequado -->
<div class="flex items-center justify-center py-12">
  <div class="text-center">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    <p class="mt-4 text-gray-600">Carregando...</p>
  </div>
</div>
```

### Empty States

```html
<!-- Estado vazio -->
<div class="text-center py-12">
  <div class="text-gray-400 mb-4">
    <!-- Ícone -->
  </div>
  <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum item encontrado</h3>
  <p class="text-gray-600">Tente ajustar os filtros ou adicionar novos itens.</p>
</div>
```

## Acessibilidade

### Foco e Navegação

```html
<!-- Espaçamento adequado para foco -->
<button class="p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  <!-- Conteúdo do botão -->
</button>
```

### Contraste e Legibilidade

```html
<!-- Texto com contraste adequado -->
<p class="text-gray-900">Texto principal</p>
<p class="text-gray-600">Texto secundário</p>
<p class="text-gray-500">Texto de ajuda</p>
```

## Performance

### Otimizações de Layout

```html
<!-- Use classes utilitárias do Tailwind -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

<!-- Evite CSS customizado desnecessário -->
<!-- ❌ Não faça isso -->
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">

<!-- ✅ Faça isso -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
```

## Checklist de Implementação

Antes de implementar um layout, verifique:

- [ ] O layout é responsivo (mobile-first)
- [ ] O espaçamento entre cards segue o padrão
- [ ] Os breakpoints estão adequados
- [ ] A acessibilidade está considerada
- [ ] O código está limpo e reutilizável
- [ ] A performance está otimizada

## Exemplos de Implementação

### Service Form (Implementado)

```html
<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <!-- Coluna Esquerda -->
  <div class="space-y-6">
    <div>
      <app-card>
        <!-- Nome, descrição, categoria -->
      </app-card>
    </div>
  </div>

  <!-- Coluna Direita -->
  <div class="space-y-6">
    <div>
      <app-card>
        <!-- Preço, duração, status -->
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

### Service Detail (Implementado)

```html
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <!-- Informações Principais -->
  <div class="lg:col-span-2 space-y-6">
    <div>
      <app-card>
        <!-- Informações básicas -->
      </app-card>
    </div>
    <div *ngIf="service._count">
      <app-card>
        <!-- Estatísticas -->
      </app-card>
    </div>
  </div>

  <!-- Sidebar -->
  <div class="space-y-6">
    <div>
      <app-card>
        <!-- Informações do sistema -->
      </app-card>
    </div>
    <div>
      <app-card>
        <!-- Ações rápidas -->
      </app-card>
    </div>
  </div>
</div>
```

---

*Esta documentação deve ser atualizada conforme novos padrões são estabelecidos.*
