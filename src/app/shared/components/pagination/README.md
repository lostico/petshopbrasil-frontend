# Componente de Paginação

O componente `PaginationComponent` é um componente reutilizável do design system que fornece uma interface de paginação completa e responsiva.

## Características

- **Sempre visível**: O componente é exibido mesmo quando há apenas uma página
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Configurável**: Permite personalizar a aparência e comportamento
- **Acessível**: Segue as melhores práticas de acessibilidade
- **Integrado ao Design System**: Usa os componentes e tokens do design system

## Uso

```typescript
import { PaginationComponent, PaginationConfig } from '../../shared/components/pagination/pagination.component';

@Component({
  imports: [PaginationComponent],
  // ...
})
export class MyComponent {
  paginationConfig: PaginationConfig = {
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    itemsPerPage: 10,
    showInfo: true,
    showPageNumbers: true,
    maxVisiblePages: 5
  };

  onPageChange(page: number): void {
    this.paginationConfig.currentPage = page;
    // Carregar dados da nova página
  }
}
```

```html
<app-pagination
  [config]="paginationConfig"
  (pageChange)="onPageChange($event)">
</app-pagination>
```

## Configuração

### PaginationConfig

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `currentPage` | `number` | `1` | Página atual |
| `totalPages` | `number` | `1` | Total de páginas |
| `totalItems` | `number` | `0` | Total de itens |
| `itemsPerPage` | `number` | `10` | Itens por página |
| `showInfo` | `boolean` | `true` | Mostrar informações da página |
| `showPageNumbers` | `boolean` | `true` | Mostrar números das páginas |
| `maxVisiblePages` | `number` | `5` | Máximo de páginas visíveis |

## Eventos

### pageChange

Emitido quando o usuário clica em uma página diferente.

```typescript
@Output() pageChange = new EventEmitter<number>();
```

## Estilos

O componente usa classes do Tailwind CSS e segue o design system:

- **Cores**: Usa as cores do design system (primary, secondary)
- **Espaçamento**: Segue o sistema de espaçamento do Tailwind
- **Responsividade**: Adapta-se a diferentes tamanhos de tela
- **Estados**: Inclui estados hover, active e disabled

## Responsividade

- **Desktop**: Mostra todos os elementos em linha
- **Mobile**: Reorganiza os elementos em coluna para melhor usabilidade

## Acessibilidade

- Botões com labels apropriados
- Estados disabled claramente indicados
- Navegação por teclado suportada
- Contraste adequado para todos os elementos
