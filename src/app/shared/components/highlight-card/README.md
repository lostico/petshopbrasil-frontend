# HighlightCard Component

## 🎯 Descrição

Componente de card de destaque baseado no estilo elegante e profissional usado anteriormente no modal de detalhes do pet. Oferece uma aparência mais sofisticada com fundo cinza claro, bordas sutis, padding adequado e efeitos de hover.

## 🎨 Características

- **Estilo elegante** com fundo `#f9fafb` e bordas `#e5e7eb`
- **Efeitos de hover** com sombras suaves
- **Padding adequado** para espaçamento interno
- **Múltiplas variantes** (default, elevated, outlined)
- **Diferentes tamanhos** (sm, md, lg)
- **Totalmente responsivo**
- **Conteúdo flexível** - quem usa define o conteúdo completo

## 📋 Props

| **Prop** | **Tipo** | **Padrão** | **Descrição** |
|----------|----------|------------|---------------|
| `variant` | `HighlightCardVariant` | `'default'` | Variante do card |
| `size` | `HighlightCardSize` | `'md'` | Tamanho do card |
| `backgroundColor` | `string` | `undefined` | Cor de fundo customizada |
| `borderColor` | `string` | `undefined` | Cor da borda customizada |
| `footerContent` | `boolean` | `false` | Se deve renderizar footer |

## 🎨 Variantes

### **Default**
```html
<app-highlight-card>
  <h3 class="text-lg font-semibold text-secondary-900 mb-4">Informações Básicas</h3>
  <!-- Conteúdo -->
</app-highlight-card>
```

### **Elevated**
```html
<app-highlight-card variant="elevated">
  <h3 class="text-lg font-semibold text-secondary-900 mb-4">Estatísticas</h3>
  <!-- Conteúdo -->
</app-highlight-card>
```

### **Outlined**
```html
<app-highlight-card variant="outlined">
  <h3 class="text-lg font-semibold text-secondary-900 mb-4">Datas</h3>
  <!-- Conteúdo -->
</app-highlight-card>
```

## 📏 Tamanhos

### **Small (sm) - 16px padding**
```html
<app-highlight-card size="sm">
  <h3 class="text-lg font-semibold text-secondary-900 mb-4">Card Pequeno</h3>
  <!-- Conteúdo -->
</app-highlight-card>
```

### **Medium (md) - 24px padding (Padrão)**
```html
<app-highlight-card>
  <h3 class="text-lg font-semibold text-secondary-900 mb-4">Card Médio</h3>
  <!-- Conteúdo -->
</app-highlight-card>
```

### **Large (lg) - 32px padding**
```html
<app-highlight-card size="lg">
  <h3 class="text-lg font-semibold text-secondary-900 mb-4">Card Grande</h3>
  <!-- Conteúdo -->
</app-highlight-card>
```

## 🎯 Exemplos de Uso

### **Card com Título e Conteúdo**
```html
<app-highlight-card>
  <h3 class="text-lg font-semibold text-secondary-900 mb-4">Informações do Pet</h3>
  
  <div class="space-y-3">
    <div class="flex items-center gap-2 text-secondary-600 text-sm">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2v20"/>
        <path d="M2 12h20"/>
      </svg>
      <span>Sexo: Macho</span>
    </div>
    
    <div class="flex items-center gap-2 text-secondary-600 text-sm">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
      <span>Idade: 3 anos</span>
    </div>
  </div>
</app-highlight-card>
```

### **Card com Footer**
```html
<app-highlight-card 
  variant="elevated"
  [footerContent]="true">
  
  <h3 class="text-lg font-semibold text-secondary-900 mb-4">Ações</h3>
  <p class="text-secondary-600">Selecione uma ação para continuar</p>
  
  <div footer class="flex gap-2">
    <app-button label="Cancelar" variant="secondary"></app-button>
    <app-button label="Confirmar" variant="primary"></app-button>
  </div>
</app-highlight-card>
```

### **Card com Cores Customizadas**
```html
<app-highlight-card 
  backgroundColor="#fef3c7"
  borderColor="#f59e0b">
  
  <h3 class="text-lg font-semibold text-amber-900 mb-4">Status</h3>
  <p class="text-amber-800">Este é um card com cores customizadas</p>
</app-highlight-card>
```

## 🎨 Estilos CSS

### **Base**
```css
.highlight-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
}
```

### **Hover Effect**
```css
.highlight-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

### **Elevated Variant**
```css
.highlight-card.elevated {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.highlight-card.elevated:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
```

### **Outlined Variant**
```css
.highlight-card.outlined {
  background: white;
  border: 2px solid #e5e7eb;
}

.highlight-card.outlined:hover {
  border-color: #d1d5db;
}
```

## 📱 Responsividade

O componente é totalmente responsivo e se adapta a diferentes tamanhos de tela:

- **Desktop**: Padding completo conforme o tamanho selecionado
- **Tablet/Mobile** (`max-width: 768px`): 
  - **Medium**: `20px` (reduzido de 24px)
  - **Large**: `24px` (reduzido de 32px)
  - **Small**: mantém `16px`

## ✅ Benefícios

- **Estilo consistente** com o design anterior mais elegante
- **Fácil de usar** com props intuitivas
- **Flexível** com múltiplas variantes e tamanhos
- **Acessível** com estrutura semântica adequada
- **Performance** otimizada com CSS inline
- **Manutenível** com código limpo e bem documentado

## 🔧 Integração

Para usar o componente, importe-o no seu módulo:

```typescript
import { HighlightCardComponent } from '../../shared/components/highlight-card/highlight-card.component';

@Component({
  imports: [HighlightCardComponent],
  // ...
})
```

Ou use a importação global:

```typescript
import { HighlightCardComponent } from '../../shared/components';
```
