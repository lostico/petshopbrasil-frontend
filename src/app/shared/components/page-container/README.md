# PageContainer Component

Componente que fornece a estrutura base padronizada para todas as páginas da aplicação.

## Características

- **Altura mínima**: `min-h-screen` para ocupar toda a altura da tela
- **Cor de fundo**: `bg-secondary-50` para consistência visual
- **Padding**: `p-6` para espaçamento interno
- **Largura máxima**: `max-w-7xl` para limitar a largura em telas grandes
- **Centralização**: `mx-auto` para centralizar o conteúdo

## Uso

```html
<app-page-container>
  <!-- Todo o conteúdo da página vai aqui -->
  <app-page-header title="Minha Página"></app-page-header>
  
  <!-- Resto do conteúdo -->
</app-page-container>
```

## Estrutura CSS Aplicada

```css
.min-h-screen {
  min-height: 100vh;
}

.bg-secondary-50 {
  background-color: /* cor secundária 50 */;
}

.p-6 {
  padding: 1.5rem;
}

.max-w-7xl {
  max-width: 80rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
```

## Benefícios

- ✅ **Consistência visual** em todas as páginas
- ✅ **Responsividade** automática
- ✅ **Redução de código** duplicado
- ✅ **Manutenção centralizada** do layout base
- ✅ **Facilidade de uso** com content projection

## Exemplo Completo

```html
<app-page-container>
  <app-page-header
    title="Clientes"
    subtitle="Gerencie os clientes da sua clínica"
    [action]="{
      label: 'Novo Cliente',
      icon: 'plus',
      variant: 'primary'
    }"
    (actionClick)="onAddCustomer()">
  </app-page-header>

  <!-- Conteúdo da página -->
  <div class="mb-6">
    <app-input
      type="search"
      placeholder="Buscar clientes...">
    </app-input>
  </div>

  <!-- Grid de clientes -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Cards de clientes -->
  </div>
</app-page-container>
```
