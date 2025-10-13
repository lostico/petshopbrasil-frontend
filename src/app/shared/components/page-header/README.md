# PageHeader Component

Componente padronizado para cabeçalhos de página com título, subtítulo e botão de ação opcional.

## Uso

```html
<app-page-header
  title="Título da Página"
  subtitle="Descrição opcional da página"
  [action]="{
    label: 'Nova Ação',
    icon: 'plus',
    variant: 'primary'
  }"
  (actionClick)="onActionClick()">
</app-page-header>
```

## Propriedades

### @Input() title: string
Título principal da página (obrigatório)

### @Input() subtitle?: string
Subtítulo opcional da página

### @Input() action?: PageHeaderAction
Configuração do botão de ação principal (opcional)

### @Input() secondaryAction?: PageHeaderSecondaryAction
Configuração do botão de ação secundário (opcional)

#### PageHeaderAction / PageHeaderSecondaryAction
- `label: string` - Texto do botão
- `icon?: 'plus' | 'edit' | 'trash' | 'arrow-left' | 'arrow-right' | 'check' | 'x' | 'eye' | 'cog'` - Ícone opcional
- `variant?: ButtonVariant` - Variante do botão (padrão: 'primary' para action, 'secondary' para secondaryAction)
- `size?: ButtonSize` - Tamanho do botão (padrão: 'md')
- `disabled?: boolean` - Estado desabilitado do botão

## Eventos

### @Output() actionClick: EventEmitter<void>
Emitido quando o botão de ação principal é clicado

### @Output() secondaryActionClick: EventEmitter<void>
Emitido quando o botão de ação secundário é clicado

## Exemplos

### Cabeçalho simples
```html
<app-page-header title="Clientes"></app-page-header>
```

### Cabeçalho com subtítulo
```html
<app-page-header 
  title="Clientes" 
  subtitle="Gerencie os clientes da sua clínica">
</app-page-header>
```

### Cabeçalho com ação
```html
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
```

### Cabeçalho com ação desabilitada
```html
<app-page-header
  title="Relatórios"
  [action]="{
    label: 'Gerar Relatório',
    icon: 'check',
    variant: 'secondary',
    disabled: true
  }"
  (actionClick)="onGenerateReport()">
</app-page-header>
```

### Cabeçalho com dois botões
```html
<app-page-header
  title="Detalhes do Serviço"
  subtitle="Visualize e edite as informações do serviço"
  [action]="{
    label: 'Voltar',
    icon: 'arrow-left',
    variant: 'secondary'
  }"
  [secondaryAction]="{
    label: 'Editar',
    icon: 'edit',
    variant: 'primary'
  }"
  (actionClick)="onBack()"
  (secondaryActionClick)="onEdit()">
</app-page-header>
```
