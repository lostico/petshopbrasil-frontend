# Toast Component

Sistema de notificações toast para feedback ao usuário, exibido no canto superior direito da tela.

## Características

- **Múltiplos tipos**: Success, Error, Warning, Info
- **Auto-dismiss**: Desaparece automaticamente após tempo configurável
- **Barra de progresso**: Mostra tempo restante visualmente
- **Animações**: Entrada e saída suaves
- **Responsivo**: Adaptável a diferentes tamanhos de tela
- **Acessível**: Suporte a navegação por teclado

## Uso Básico

### 1. Injetar o ToastService

```typescript
import { ToastService } from '@shared/services/toast.service';

constructor(private toastService: ToastService) {}
```

### 2. Exibir toasts

```typescript
// Toast de sucesso
this.toastService.success('Título', 'Mensagem de sucesso');

// Toast de erro
this.toastService.error('Erro', 'Ocorreu um erro');

// Toast de aviso
this.toastService.warning('Atenção', 'Ação requer atenção');

// Toast de informação
this.toastService.info('Informação', 'Dados atualizados');
```

## Métodos Disponíveis

### Métodos Principais

| Método | Descrição | Duração Padrão |
|--------|-----------|----------------|
| `success(title, message, duration?)` | Toast de sucesso | 5 segundos |
| `error(title, message, duration?)` | Toast de erro | 7 segundos |
| `warning(title, message, duration?)` | Toast de aviso | 6 segundos |
| `info(title, message, duration?)` | Toast de informação | 5 segundos |
| `show(config)` | Toast customizado | Configurável |

### Métodos de Conveniência

| Método | Descrição |
|--------|-----------|
| `showSuccess(message, title?)` | Sucesso com título padrão |
| `showError(message, title?)` | Erro com título padrão |
| `showStatusUpdate(serviceName, isActive)` | Atualização de status |
| `showServiceCreated(serviceName)` | Serviço criado |
| `showServiceUpdated(serviceName)` | Serviço atualizado |
| `showServiceDeleted(serviceName)` | Serviço excluído |

## Configuração Avançada

### ToastConfig Interface

```typescript
interface ToastConfig {
  id: string;                    // ID único do toast
  title: string;                 // Título do toast
  message: string;               // Mensagem do toast
  variant: ToastVariant;         // Tipo: 'success' | 'error' | 'warning' | 'info'
  duration?: number;             // Duração em ms (0 = não auto-dismiss)
  position?: ToastPosition;      // Posição (padrão: 'top-right')
  showCloseButton?: boolean;     // Mostrar botão fechar (padrão: true)
}
```

### Exemplo de Toast Customizado

```typescript
const config: ToastConfig = {
  id: 'custom-toast',
  title: 'Título Customizado',
  message: 'Mensagem personalizada',
  variant: 'info',
  duration: 10000, // 10 segundos
  showCloseButton: true
};

this.toastService.show(config);
```

## Variantes Visuais

### Success (Verde)
- **Ícone**: Check mark
- **Cor**: Verde (#10b981)
- **Uso**: Operações bem-sucedidas

### Error (Vermelho)
- **Ícone**: X mark
- **Cor**: Vermelho (#ef4444)
- **Uso**: Erros e falhas

### Warning (Amarelo)
- **Ícone**: Triângulo de aviso
- **Cor**: Amarelo (#f59e0b)
- **Uso**: Avisos e alertas

### Info (Azul)
- **Ícone**: Círculo de informação
- **Cor**: Azul (#3b82f6)
- **Uso**: Informações gerais

## Posições Disponíveis

| Posição | Classe CSS |
|---------|------------|
| `top-right` | `fixed top-4 right-4` |
| `top-left` | `fixed top-4 left-4` |
| `bottom-right` | `fixed bottom-4 right-4` |
| `bottom-left` | `fixed bottom-4 left-4` |
| `top-center` | `fixed top-4 left-1/2 transform -translate-x-1/2` |
| `bottom-center` | `fixed bottom-4 left-1/2 transform -translate-x-1/2` |

## Animações

### Entrada
- **Animação**: Slide in from top
- **Duração**: 300ms
- **Easing**: ease-out

### Saída
- **Animação**: Fade out
- **Duração**: 200ms
- **Easing**: ease-in

## Responsividade

### Desktop
- Posição: Canto superior direito
- Largura máxima: 384px (max-w-sm)
- Espaçamento: 16px do topo e direita

### Mobile
- Posição: Topo centralizado
- Largura: 100% - 32px de margem
- Espaçamento: 16px do topo

## Acessibilidade

### Recursos Implementados
- **ARIA labels**: Para leitores de tela
- **Focus management**: Navegação por teclado
- **Contraste**: Cores com contraste adequado
- **Animações**: Respeitam preferências do usuário

### Navegação por Teclado
- **Tab**: Navega entre toasts
- **Enter/Space**: Fecha toast selecionado
- **Escape**: Fecha toast ativo

## Exemplos de Uso

### Operações CRUD

```typescript
// Criar serviço
this.serviceService.createService(data).subscribe({
  next: (response) => {
    this.toastService.showServiceCreated(response.service.name);
  },
  error: (error) => {
    this.toastService.showError('Erro ao criar serviço');
  }
});

// Atualizar serviço
this.serviceService.updateService(id, data).subscribe({
  next: (response) => {
    this.toastService.showServiceUpdated(response.service.name);
  },
  error: (error) => {
    this.toastService.showError('Erro ao atualizar serviço');
  }
});

// Excluir serviço
this.serviceService.deleteService(id).subscribe({
  next: () => {
    this.toastService.showServiceDeleted(serviceName);
  },
  error: (error) => {
    this.toastService.showError('Erro ao excluir serviço');
  }
});
```

### Atualização de Status

```typescript
// Toggle de status
this.serviceService.updateServiceStatus(id, newStatus).subscribe({
  next: () => {
    const action = newStatus ? 'ativado' : 'desativado';
    this.toastService.showStatusUpdate(serviceName, newStatus);
  },
  error: (error) => {
    this.toastService.showError('Erro ao atualizar status');
  }
});
```

## Integração no App

### 1. Adicionar Container no App Component

```html
<!-- app.component.html -->
<router-outlet></router-outlet>
<app-toast-container></app-toast-container>
```

### 2. Importar no App Component

```typescript
// app.component.ts
import { ToastContainerComponent } from './shared/components/toast/toast-container.component';

@Component({
  imports: [RouterOutlet, ToastContainerComponent],
  // ...
})
```

## Performance

### Otimizações Implementadas
- **Lazy loading**: Componentes carregados sob demanda
- **Memory management**: Limpeza automática de toasts
- **Animation optimization**: Usa CSS transforms
- **Event cleanup**: Remove listeners ao destruir

### Limitações
- Máximo de 5 toasts simultâneos
- Duração mínima: 1000ms
- Duração máxima: 30000ms

## Troubleshooting

### Toast não aparece
1. Verificar se `ToastContainerComponent` está importado no app
2. Verificar se `ToastService` está injetado corretamente
3. Verificar console para erros

### Toast não fecha automaticamente
1. Verificar se `duration` está definido
2. Verificar se não há erros no console
3. Verificar se o toast não foi pausado

### Múltiplos toasts sobrepostos
1. Verificar se há múltiplas instâncias do container
2. Verificar se o serviço está sendo injetado múltiplas vezes
3. Verificar se há memory leaks

---

*Este sistema de toast fornece feedback visual consistente e profissional para todas as operações da aplicação.*
