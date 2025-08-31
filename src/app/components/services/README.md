# CRUD de Serviços

Este módulo implementa o CRUD completo de serviços para a clínica veterinária, seguindo a documentação da API fornecida.

## 📁 Estrutura de Arquivos

```
src/app/components/services/
├── service-list/           # Listagem de serviços
│   ├── service-list.component.ts
│   ├── service-list.component.html
│   └── service-list.component.css
├── service-form/           # Formulário de criação/edição
│   ├── service-form.component.ts
│   ├── service-form.component.html
│   └── service-form.component.css
├── service-detail/         # Visualização detalhada
│   ├── service-detail.component.ts
│   ├── service-detail.component.html
│   └── service-detail.component.css
└── index.ts               # Exportações
```

## 🚀 Funcionalidades

### ServiceListComponent
- **Listagem paginada** de todos os serviços
- **Filtros avançados**: busca por nome/descrição, categoria, status, preço
- **Ações em lote**: ativar/desativar, editar, visualizar, deletar
- **Modal de confirmação** para exclusão
- **Responsivo** para mobile e desktop

### ServiceFormComponent
- **Criação** de novos serviços
- **Edição** de serviços existentes
- **Validação em tempo real** dos campos
- **Formatação automática** de preço e duração
- **Contador de caracteres** para descrição
- **Modo de edição** com informações adicionais

### ServiceDetailComponent
- **Visualização completa** do serviço
- **Estatísticas** de uso (agendamentos, pedidos)
- **Ações rápidas** (editar, ativar/desativar)
- **Informações do sistema** (datas, ID)
- **Layout responsivo** com sidebar

## 🔧 Service Service

O `ServiceService` implementa todas as operações da API:

### Métodos Principais
- `getAllServices()` - Lista com filtros e paginação
- `getServiceById()` - Busca por ID
- `createService()` - Cria novo serviço
- `updateService()` - Atualiza serviço
- `updateServiceStatus()` - Ativa/desativa
- `deleteService()` - Remove serviço

### Utilitários
- `formatPrice()` - Formatação em Real (R$)
- `formatDuration()` - Formatação de duração (30min, 1h 30min)
- `getCategoryName()` - Nomes em português das categorias

## 📊 Categorias de Serviço

```typescript
enum ServiceCategory {
  GROOMING = 'GROOMING',           // Banho e tosa
  VACCINATION = 'VACCINATION',     // Vacinação
  CONSULTATION = 'CONSULTATION',   // Consulta veterinária
  SURGERY = 'SURGERY',             // Cirurgia
  DENTAL = 'DENTAL',               // Tratamento dental
  EMERGENCY = 'EMERGENCY',         // Emergência
  OTHER = 'OTHER'                  // Outros
}
```

## 🛣️ Rotas

```typescript
// Listagem
/services

// Novo serviço
/services/new

// Detalhes do serviço
/services/:id

// Editar serviço
/services/:id/edit
```

## 🎨 Design System

Utiliza componentes do design system compartilhado:
- `ButtonComponent` - Botões com variantes
- `InputComponent` - Campos de entrada
- `SelectComponent` - Seletores
- `CardComponent` - Cards de conteúdo
- `BadgeComponent` - Badges de status
- `AlertComponent` - Alertas de feedback
- `ModalComponent` - Modais de confirmação

## 📱 Responsividade

- **Mobile First** - Layout otimizado para dispositivos móveis
- **Grid responsivo** - Adaptação automática para diferentes telas
- **Touch friendly** - Botões e interações otimizadas para touch
- **Breakpoints** - sm (640px), md (768px), lg (1024px), xl (1280px)

## 🔒 Validações

### Campos Obrigatórios
- **Nome**: 3-100 caracteres
- **Preço**: > 0, máximo R$ 999.999,99
- **Duração**: 1-480 minutos (8 horas)
- **Categoria**: obrigatória

### Campos Opcionais
- **Descrição**: máximo 500 caracteres
- **Status**: padrão ativo

## 🎯 Exemplos de Uso

### Criar Serviço
```typescript
const newService = {
  name: 'Consulta Veterinária',
  description: 'Consulta veterinária completa com exame físico',
  price: 150.00,
  duration: 30,
  category: ServiceCategory.CONSULTATION,
  isActive: true
};

this.serviceService.createService(newService).subscribe({
  next: (response) => console.log('Serviço criado:', response),
  error: (error) => console.error('Erro:', error)
});
```

### Filtrar Serviços
```typescript
const filters = {
  search: 'consulta',
  category: ServiceCategory.CONSULTATION,
  isActive: true,
  minPrice: 50,
  maxPrice: 200,
  page: 1,
  limit: 10
};

this.serviceService.getAllServices(filters).subscribe({
  next: (response) => console.log('Serviços:', response.data),
  error: (error) => console.error('Erro:', error)
});
```

## 🚨 Tratamento de Erros

- **400** - Dados inválidos (validação)
- **401** - Não autenticado
- **403** - Sem permissão
- **404** - Serviço não encontrado
- **409** - Conflito (serviço com agendamentos)
- **500** - Erro interno

## 📈 Performance

- **Lazy loading** - Componentes carregados sob demanda
- **Debounce** - Busca com delay de 500ms
- **Pagination** - Carregamento paginado
- **Caching** - Dados em memória durante sessão
- **Optimistic updates** - Atualizações otimistas de status

## 🔄 Estado da Aplicação

- **Loading states** - Indicadores de carregamento
- **Error handling** - Tratamento de erros com feedback
- **Success feedback** - Confirmações de sucesso
- **Form validation** - Validação em tempo real
- **Dirty checking** - Detecção de mudanças

## 🧪 Testes

Para testar o CRUD de serviços:

1. **Acesse** `/services` para ver a listagem
2. **Clique** em "Novo Serviço" para criar
3. **Preencha** o formulário com dados válidos
4. **Teste** os filtros na listagem
5. **Clique** em um serviço para ver detalhes
6. **Edite** um serviço existente
7. **Teste** ativar/desativar status
8. **Delete** um serviço (com confirmação)

## 📝 Notas de Implementação

- Segue padrões do Angular 17+ com standalone components
- Utiliza Reactive Forms para validação
- Implementa padrão Observer com RxJS
- Segue convenções de nomenclatura do projeto
- Integra com sistema de autenticação existente
- Compatível com sistema de permissões


