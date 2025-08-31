# Textarea Component

Componente de textarea reutilizável do design system, seguindo os padrões visuais e de comportamento estabelecidos.

## Características

- **ControlValueAccessor**: Compatível com Reactive Forms
- **Estados visuais**: Normal, foco, erro, sucesso e desabilitado
- **Contador de caracteres**: Opcional com limite configurável
- **Tamanhos**: sm, md, lg
- **Responsivo**: Adaptável a diferentes tamanhos de tela
- **Acessível**: Suporte a labels, aria-labels e navegação por teclado

## Uso Básico

```html
<app-textarea
  id="description"
  label="Descrição"
  placeholder="Digite sua descrição..."
  formControlName="description">
</app-textarea>
```

## Propriedades

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

## Exemplos

### Com contador de caracteres
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

### Com validação e mensagem de erro
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

### Tamanhos diferentes
```html
<!-- Pequeno -->
<app-textarea size="sm" rows="2" label="Resumo"></app-textarea>

<!-- Médio (padrão) -->
<app-textarea size="md" rows="4" label="Descrição"></app-textarea>

<!-- Grande -->
<app-textarea size="lg" rows="6" label="Conteúdo"></app-textarea>
```

### Desabilitado
```html
<app-textarea
  label="Descrição"
  [disabled]="true"
  value="Texto não editável">
</app-textarea>
```

### Sem redimensionamento
```html
<app-textarea
  label="Descrição"
  [noResize]="true"
  rows="3">
</app-textarea>
```

## Estilos

O componente utiliza as classes do Tailwind CSS e segue o sistema de design estabelecido:

- **Cores**: Utiliza as variáveis de cor do design system
- **Espaçamento**: Segue o sistema de spacing do Tailwind
- **Tipografia**: Usa as classes de texto padronizadas
- **Estados**: Estados visuais consistentes com outros componentes

## Integração com Forms

O componente implementa `ControlValueAccessor`, permitindo uso direto com Reactive Forms:

```typescript
// No componente
this.form = this.fb.group({
  description: ['', [Validators.required, Validators.maxLength(500)]]
});
```

```html
<!-- No template -->
<app-textarea
  formControlName="description"
  [invalid]="description?.invalid && description?.touched">
</app-textarea>
```
