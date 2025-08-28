# Button Component

Componente de botão reutilizável com suporte a ícones Lucide, diferentes variantes, tamanhos e estados.

## Como usar

### Importação

```typescript
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  imports: [ButtonComponent]
})
```

### Uso básico

```html
<!-- Botão simples -->
<app-button label="Clique aqui"></app-button>

<!-- Botão com ícone -->
<app-button variant="primary" icon="plus" label="Adicionar"></app-button>

<!-- Apenas ícone -->
<app-button variant="outline" icon="edit"></app-button>

<!-- Botão em loading -->
<app-button [loading]="true" label="Carregando..."></app-button>
```

## Propriedades

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|---------|-----------|
| `variant` | `ButtonVariant` | `'primary'` | Estilo do botão |
| `size` | `ButtonSize` | `'md'` | Tamanho do botão |
| `disabled` | `boolean` | `false` | Estado desabilitado |
| `loading` | `boolean` | `false` | Estado de carregamento |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Tipo do botão |
| `icon` | `string` | `undefined` | Ícone a ser exibido |
| `label` | `string` | `undefined` | Texto do botão |
| `fullWidth` | `boolean` | `false` | Ocupa toda a largura disponível |

## Eventos

| Evento | Tipo | Descrição |
|--------|------|-----------|
| `clicked` | `EventEmitter<MouseEvent>` | Emitido quando o botão é clicado |

## Variantes disponíveis

```typescript
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
```

- **primary**: Azul sólido, para ações principais
- **secondary**: Cinza claro, para ações secundárias  
- **outline**: Borda azul com fundo transparente
- **ghost**: Sem borda, fundo transparente
- **danger**: Vermelho sólido, para ações destrutivas

## Tamanhos disponíveis

```typescript
type ButtonSize = 'sm' | 'md' | 'lg';
```

- **sm**: Pequeno (padding: 0.375rem 0.75rem, font-size: 0.875rem)
- **md**: Médio (padding: 0.5rem 1rem, font-size: 0.875rem)
- **lg**: Grande (padding: 0.75rem 1.5rem, font-size: 1rem)

## Ícones disponíveis

Os seguintes ícones estão pré-configurados e prontos para uso:

| Nome | Descrição | Ícone Lucide |
|------|-----------|--------------|
| `plus` | Adicionar/Mais | `plus` |
| `edit` | Editar | `edit` |
| `trash` | Excluir/Lixeira | `trash-2` |
| `arrow-left` | Seta esquerda | `arrow-left` |
| `arrow-right` | Seta direita | `arrow-right` |
| `check` | Confirmação/Check | `check` |
| `x` | Fechar/Cancelar | `x` |
| `eye` | Visualizar | `eye` |
| `cog` | Configurações | `settings` |

## Exemplos práticos

### Botões de ação

```html
<!-- Ações CRUD -->
<app-button variant="primary" icon="plus" label="Criar" (clicked)="onCreate()"></app-button>
<app-button variant="outline" icon="eye" label="Visualizar" (clicked)="onView()"></app-button>
<app-button variant="secondary" icon="edit" label="Editar" (clicked)="onEdit()"></app-button>
<app-button variant="danger" icon="trash" label="Excluir" (clicked)="onDelete()"></app-button>

<!-- Navegação -->
<app-button variant="ghost" icon="arrow-left" label="Voltar" (clicked)="onBack()"></app-button>
<app-button variant="primary" icon="arrow-right" label="Próximo" (clicked)="onNext()"></app-button>
```

### Botões de formulário

```html
<!-- Formulário -->
<form (ngSubmit)="onSubmit()">
  <!-- campos do formulário -->
  
  <div class="flex gap-3 justify-end">
    <app-button 
      variant="ghost" 
      label="Cancelar" 
      (clicked)="onCancel()">
    </app-button>
    
    <app-button 
      type="submit"
      variant="primary" 
      icon="check"
      label="Salvar"
      [loading]="isSaving">
    </app-button>
  </div>
</form>
```

### Botões compactos (apenas ícone)

```html
<!-- Barra de ações -->
<div class="flex gap-2">
  <app-button variant="outline" icon="eye" size="sm"></app-button>
  <app-button variant="secondary" icon="edit" size="sm"></app-button>
  <app-button variant="danger" icon="trash" size="sm"></app-button>
  <app-button variant="ghost" icon="cog" size="sm"></app-button>
</div>
```

## Como adicionar novos ícones

Para adicionar novos ícones ao projeto, siga estes passos:

### 1. Instalar ícone (se necessário)

O Lucide Angular já está instalado no projeto, mas você pode verificar a [documentação oficial](https://lucide.dev/icons) para encontrar novos ícones.

### 2. Configurar no app.config.ts

```typescript
// src/app/app.config.ts
import { 
  LucideAngularModule,
  Plus,
  Edit,
  // ... outros ícones existentes
  Search,  // ← Novo ícone
  Download // ← Novo ícone
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... outros providers
    importProvidersFrom(
      LucideAngularModule.pick({
        Plus,
        Edit,
        // ... outros ícones existentes
        Search,  // ← Adicionar aqui
        Download // ← Adicionar aqui
      })
    )
  ]
};
```

### 3. Atualizar o mapeamento no button.component.ts

```typescript
// src/app/shared/components/button/button.component.ts
getLucideIconName(): string {
  const iconMap: Record<string, string> = {
    'plus': 'plus',
    'edit': 'edit',
    // ... outros ícones existentes
    'search': 'search',     // ← Adicionar mapeamento
    'download': 'download'  // ← Adicionar mapeamento
  };
  return iconMap[this.icon || ''] || '';
}
```

### 4. Atualizar o tipo TypeScript

```typescript
// src/app/shared/components/button/button.component.ts
@Input() icon?: 'plus' | 'edit' | 'trash' | 'arrow-left' | 'arrow-right' | 'check' | 'x' | 'eye' | 'cog' | 'search' | 'download'; // ← Adicionar novos ícones
```

### 5. Usar o novo ícone

```html
<app-button variant="primary" icon="search" label="Buscar"></app-button>
<app-button variant="secondary" icon="download" label="Download"></app-button>
```

## Boas práticas

### Escolha da variante

- Use `primary` para a ação mais importante da tela
- Use `secondary` para ações complementares  
- Use `outline` quando precisar de destaque sem peso visual excessivo
- Use `ghost` para ações menos importantes ou de navegação
- Use `danger` apenas para ações destrutivas (excluir, cancelar, etc.)

### Uso de ícones

- Combine ícone + texto para maior clareza
- Use apenas ícone em espaços reduzidos (tabelas, barras de ação)
- Mantenha consistência: use o mesmo ícone para a mesma ação em todo o app

### Estados

- Sempre use `loading` durante operações assíncronas
- Use `disabled` quando a ação não está disponível
- Forneça feedback visual adequado para o usuário

## Personalização

O componente usa Tailwind CSS e pode ser personalizado através das classes CSS definidas no arquivo. Para alterações mais específicas, edite o arquivo `button.component.ts`.

## Dependências

- Angular 17+
- Tailwind CSS
- Lucide Angular 0.542.0+

---

*Esta documentação foi gerada automaticamente. Para dúvidas ou sugestões, consulte a equipe de desenvolvimento.*
