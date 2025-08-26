# Exemplo de Refatoração com Tailwind CSS

## Antes (CSS Customizado)

### HTML
```html
<div class="customers-container">
  <div class="header">
    <div class="header-content">
      <h1>Clientes</h1>
      <p>Gerencie os clientes da sua clínica</p>
    </div>
    <button class="btn-primary" (click)="onAddCustomer()">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 5v14M5 12h14"/>
      </svg>
      Novo Cliente
    </button>
  </div>

  <div class="search-section">
    <div class="search-box">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
      <input type="text" placeholder="Buscar por nome, CPF ou email..." class="search-input">
    </div>
  </div>

  <div class="customers-grid">
    <div class="customer-card">
      <!-- conteúdo do card -->
    </div>
  </div>
</div>
```

### CSS
```css
.customers-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 24px;
}

.header-content h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.header-content p {
  color: #6b7280;
  margin: 0;
  font-size: 1rem;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.search-section {
  margin-bottom: 24px;
}

.search-box {
  position: relative;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 44px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.customers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.customer-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

## Depois (Tailwind CSS)

### HTML
```html
<div class="page-container">
  <!-- Header usando classes do Tailwind -->
  <div class="page-header">
    <div>
      <h1 class="page-title">Clientes</h1>
      <p class="page-subtitle">Gerencie os clientes da sua clínica</p>
    </div>
    <button class="btn-primary" (click)="onAddCustomer()">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 5v14M5 12h14"/>
      </svg>
      Novo Cliente
    </button>
  </div>

  <!-- Search section usando classes do Tailwind -->
  <div class="search-section">
    <div class="search-box">
      <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
      <input 
        type="text" 
        placeholder="Buscar por nome, CPF ou email..." 
        class="input-search"
      >
    </div>
  </div>

  <!-- Grid usando classes do Tailwind -->
  <div class="grid-responsive">
    <div class="card-listing">
      <!-- conteúdo do card -->
    </div>
  </div>
</div>
```

### CSS (Mínimo)
```css
/* Apenas estilos específicos que o Tailwind não atende */
.custom-animation {
  animation: customKeyframe 0.5s ease-in-out;
}

@keyframes customKeyframe {
  /* animação específica */
}
```

## Benefícios da Refatoração

### 1. **Menos Código CSS**
- **Antes**: ~100 linhas de CSS
- **Depois**: ~5 linhas de CSS (apenas específicos)

### 2. **Consistência Automática**
- Todos os componentes usam as mesmas classes
- Breakpoints responsivos padronizados
- Cores e espaçamentos consistentes

### 3. **Manutenibilidade**
- Mudanças globais em um lugar só
- Menos arquivos CSS para manter
- Classes auto-documentadas

### 4. **Performance**
- CSS otimizado automaticamente
- Menos bytes transferidos
- Carregamento mais rápido

## Checklist de Refatoração

Para cada componente, verifique:

- [ ] Substituir containers por classes `.page-container`, `.app-container`
- [ ] Usar `.page-header` para headers de página
- [ ] Aplicar `.btn-primary`, `.btn-secondary` para botões
- [ ] Utilizar `.input-base`, `.input-search` para inputs
- [ ] Implementar `.card-base`, `.card-listing` para cards
- [ ] Aplicar `.grid-responsive` para grids
- [ ] Usar classes de status `.status-active`, `.status-inactive`
- [ ] Implementar `.loading-container` para loading
- [ ] Aplicar `.error-message` para erros
- [ ] Usar `.empty-state` para estados vazios
- [ ] Implementar `.pagination` para paginação

## Próximos Passos

1. **Refatorar componentes existentes** seguindo este padrão
2. **Remover CSS customizado** desnecessário
3. **Documentar componentes** específicos que precisam de CSS customizado
4. **Treinar equipe** nas novas diretrizes
5. **Implementar linting** para garantir conformidade
