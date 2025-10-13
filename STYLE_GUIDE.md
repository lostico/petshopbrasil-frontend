# 🎨 Guia de Estilo - Padronização de Páginas

## 📋 Visão Geral

Este documento define os padrões visuais globais para todas as páginas do sistema PetShop Brasil, garantindo consistência visual e semântica em todo o projeto.

## 🎯 Objetivos

- **Consistência Visual**: Todas as páginas seguem o mesmo padrão de layout e estilo
- **Manutenibilidade**: Mudanças globais podem ser feitas facilmente
- **Produtividade**: Desenvolvedores podem usar classes pré-definidas
- **UX Coerente**: Experiência do usuário uniforme em todo o sistema

## 🏗️ Estrutura de Classes

### Container Principal
```html
<div class="page-container">
  <div class="page-content">
    <!-- Conteúdo da página -->
  </div>
</div>
```

### Header da Página
```html
<div class="page-header">
  <div>
    <h1 class="text-3xl font-bold text-secondary-900 mb-2">Título da Página</h1>
    <p class="text-secondary-600">Descrição da página</p>
  </div>
  <app-button variant="primary" icon="plus" label="Nova Ação">
  </app-button>
</div>
```

### Seção de Busca
```html
<!-- Busca simples -->
<div class="page-search-section">
  <app-input type="search" placeholder="Buscar...">
  </app-input>
</div>

<!-- Busca com filtros -->
<div class="page-search-with-filters">
  <app-input type="search" placeholder="Buscar..." class="flex-1 min-w-80">
  </app-input>
  <app-select placeholder="Filtro 1" class="min-w-48">
  </app-select>
  <app-select placeholder="Filtro 2" class="min-w-48">
  </app-select>
</div>
```

### Estados de Loading
```html
<div class="flex flex-col items-center justify-center py-16">
  <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
  <p class="text-secondary-600">Carregando dados...</p>
</div>
```

### Estado Vazio
```html
<div class="text-center py-16">
  <div class="w-16 h-16 mx-auto mb-4 text-secondary-300">
    <!-- Ícone SVG -->
  </div>
  <h3 class="text-xl font-semibold text-secondary-700 mb-2">Nenhum item encontrado</h3>
  <p class="text-secondary-500 mb-6">Descrição do estado vazio</p>
  <app-button variant="primary" label="Primeira Ação">
  </app-button>
</div>
```

## 📦 Cards e Listagens

### Grid de Listagem
```html
<!-- Grid padrão (2 colunas em md) -->
<div class="page-grid">
  <!-- Cards aqui -->
</div>

<!-- Grid para pets (2 colunas em lg) -->
<div class="page-grid-pets">
  <!-- Cards aqui -->
</div>
```

### Card de Listagem
```html
<app-card variant="elevated" [hover]="true" class="h-full">
  <!-- Header do Card -->
  <div class="flex items-start justify-between mb-4">
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0" [style.background-color]="avatarColor">
        {{ initial }}
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-secondary-900 truncate">{{ title }}</h3>
        <p class="text-sm text-secondary-500">{{ subtitle }}</p>
        <app-badge [text]="status" [variant]="statusVariant" size="sm" class="mt-1">
        </app-badge>
      </div>
    </div>
    <div class="flex gap-1">
      <app-button variant="ghost" icon="eye" size="sm">
      </app-button>
      <app-button variant="ghost" icon="edit" size="sm">
      </app-button>
    </div>
  </div>

  <!-- Detalhes do Card -->
  <div class="space-y-2 mb-4">
    <div class="flex items-center gap-2 text-sm text-secondary-600">
      <svg><!-- ícone --></svg>
      <span class="truncate">{{ detail }}</span>
    </div>
  </div>

  <!-- Estatísticas do Card -->
  <div class="grid grid-cols-3 gap-4 py-3 border-t border-secondary-100 mb-3">
    <div class="text-center">
      <div class="text-lg font-semibold text-secondary-900">{{ value1 }}</div>
      <div class="text-xs text-secondary-500">{{ label1 }}</div>
    </div>
    <div class="text-center">
      <div class="text-lg font-semibold text-secondary-900">{{ value2 }}</div>
      <div class="text-xs text-secondary-500">{{ label2 }}</div>
    </div>
    <div class="text-center">
      <div class="text-lg font-semibold text-secondary-900">{{ value3 }}</div>
      <div class="text-xs text-secondary-500">{{ label3 }}</div>
    </div>
  </div>

  <!-- Footer do Card -->
  <div class="text-center pt-2 border-t border-secondary-100">
    <span class="text-xs text-secondary-400">
      Cadastrado em {{ date }}
    </span>
  </div>
</app-card>
```

### Card para Pets (Layout Especial)
```html
<app-card variant="elevated" class="page-card">
  <!-- Header do Card -->
  <div class="page-card-header">
    <div class="flex items-start gap-4">
      <div class="page-card-avatar-large" [style.background-color]="avatarColor">
        {{ petIcon }}
      </div>
      <div class="page-card-content">
        <div class="flex items-center justify-between mb-2">
          <h3 class="page-card-title-large">{{ petName }}</h3>
          <div class="page-card-actions-spaced">
            <app-button variant="secondary" size="sm" icon="eye">
            </app-button>
            <app-button variant="secondary" size="sm" icon="edit">
            </app-button>
          </div>
        </div>
        <p class="page-card-subtitle">{{ species }}</p>
        <span class="status-badge">{{ status }}</span>
      </div>
    </div>
  </div>

  <!-- Detalhes do Card -->
  <div class="page-card-details-spaced">
    <div class="page-card-detail-item">
      <svg><!-- ícone --></svg>
      <span>{{ detail }}</span>
    </div>
  </div>

  <!-- Seção do Tutor -->
  <div class="page-tutor-section">
    <div class="page-tutor-header">
      <span class="page-tutor-label">Tutor:</span>
      <span class="page-tutor-name">{{ tutorName }}</span>
    </div>
    <div class="page-tutor-info">
      <svg><!-- ícone --></svg>
      <span>{{ tutorPhone }}</span>
    </div>
  </div>

  <!-- Estatísticas do Card (2 colunas) -->
  <div class="page-card-stats-two">
    <div class="page-card-stat-item-two">
      <span class="page-card-stat-label-two">Consultas</span>
      <span class="page-card-stat-value-large">{{ appointments }}</span>
    </div>
    <div class="page-card-stat-item-two">
      <span class="page-card-stat-label-two">Prontuários</span>
      <span class="page-card-stat-value-large">{{ records }}</span>
    </div>
  </div>

  <!-- Footer do Card -->
  <div class="page-card-footer-simple">
    <span class="page-card-footer-text-two">
      Cadastrado em {{ date }}
    </span>
  </div>
</app-card>
```

## 📊 Tabelas

### Estrutura de Tabela
```html
<div class="page-table-container">
  <table class="page-table">
    <thead class="page-table-header">
      <tr>
        <th class="page-table-header-cell">Coluna 1</th>
        <th class="page-table-header-cell">Coluna 2</th>
        <th class="page-table-header-cell">Ações</th>
      </tr>
    </thead>
    <tbody class="page-table-body">
      <tr class="page-table-row">
        <td class="page-table-cell">{{ data1 }}</td>
        <td class="page-table-cell-wrap">
          <div>{{ data2 }}</div>
          <div class="text-sm text-gray-500">{{ data3 }}</div>
        </td>
        <td class="page-table-cell">
          <div class="flex items-center space-x-2">
            <app-button variant="ghost" size="sm" icon="eye">
            </app-button>
            <app-button variant="ghost" size="sm" icon="edit">
            </app-button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

## 🏷️ Seções Especiais

### Seção com Ícone e Título
```html
<div class="page-section-header">
  <div class="page-section-icon bg-primary-100">
    <svg class="text-primary-600"><!-- ícone --></svg>
  </div>
  <h2 class="page-section-title">Título da Seção</h2>
  <app-badge [text]="count" variant="info" size="sm">
  </app-badge>
</div>
```

## 📄 Paginação

### Container de Paginação
```html
<div class="page-pagination">
  <app-pagination [config]="paginationConfig" (pageChange)="onPageChange($event)">
  </app-pagination>
</div>
```

## 🎨 Cores e Tokens

### Cores Principais
- **Primary**: `primary-*` (azul)
- **Secondary**: `secondary-*` (cinza)
- **Success**: `success-*` (verde)
- **Warning**: `warning-*` (amarelo)
- **Danger**: `danger-*` (vermelho)

### Cores de Texto
- **Títulos**: `text-secondary-900`
- **Subtítulos**: `text-secondary-600`
- **Texto secundário**: `text-secondary-500`
- **Texto desabilitado**: `text-secondary-400`

### Cores de Fundo
- **Fundo da página**: `bg-secondary-50`
- **Cards**: `bg-white`
- **Seções especiais**: `bg-secondary-50`

## 📱 Responsividade

### Breakpoints
- **Mobile**: `< 640px`
- **Tablet**: `640px - 1024px`
- **Desktop**: `> 1024px`

### Grids Responsivos
- **page-grid**: 1 coluna (mobile) → 2 colunas (md+)
- **page-grid-pets**: 1 coluna (mobile) → 2 colunas (lg+)

## ✅ Checklist de Conformidade

### Para cada página, verificar:

- [ ] Usa `page-container` e `page-content`
- [ ] Header usa `page-header`, `page-title` e `page-subtitle`
- [ ] Busca usa `page-search-section` ou `page-search-with-filters`
- [ ] Loading usa `page-loading` e `page-loading-spinner`
- [ ] Estado vazio usa `page-empty-state`, `page-empty-icon`, `page-empty-title` e `page-empty-description`
- [ ] Grid usa `page-grid` ou `page-grid-pets`
- [ ] Cards seguem a estrutura padrão
- [ ] Tabelas usam classes `page-table-*`
- [ ] Paginação usa `page-pagination`
- [ ] Cores seguem o padrão definido
- [ ] Responsividade está implementada

## 🚀 Benefícios

1. **Consistência**: Todas as páginas seguem o mesmo padrão visual
2. **Manutenibilidade**: Mudanças globais em um local
3. **Produtividade**: Classes pré-definidas aceleram o desenvolvimento
4. **UX**: Experiência do usuário uniforme
5. **Escalabilidade**: Fácil adição de novas páginas

## 📚 Referências

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Design System Guidelines](./DESIGN_SYSTEM.md)
- [Tailwind Guidelines](./TAILWIND_GUIDELINES.md)

---

**Última atualização**: {{ new Date().toLocaleDateString('pt-BR') }}
