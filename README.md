# PetShop Brasil - Frontend

Frontend Angular para o sistema PetShop Brasil com autenticação JWT e interface moderna.

## Funcionalidades

- ✅ Autenticação JWT com refresh token
- ✅ Proteção de rotas com AuthGuard
- ✅ Interceptor HTTP para adicionar tokens automaticamente
- ✅ Interface responsiva com Tailwind CSS
- ✅ Formulário de login com validações
- ✅ Seleção de clínica após login
- ✅ Dashboard protegido com informações do usuário e clínica
- ✅ Logout seguro
- ✅ Configuração de múltiplos ambientes (DEV, QA, HML, PRD)
- ✅ Sistema centralizado de endpoints da API

## Estrutura do Projeto

```
src/
├── environments/
│   ├── environment.ts          # Desenvolvimento
│   ├── environment.qa.ts       # QA
│   ├── environment.hml.ts      # Homologação
│   └── environment.prod.ts     # Produção
├── app/
│   ├── config/
│   │   └── api-endpoints.ts    # Endpoints centralizados da API
│   ├── components/
│   │   ├── login/
│   │   │   └── login.component.ts
│   │   ├── clinic-select/
│   │   │   └── clinic-select.component.ts
│   │   └── dashboard/
│   │       └── dashboard.component.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── clinic.service.ts
│   │   └── pet.service.ts
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── clinic.guard.ts
│   ├── interceptors/
│   │   └── auth.interceptor.ts
│   ├── app.routes.ts
│   ├── app.config.ts
│   ├── app.component.ts
│   └── app.html
└── main.ts
```

## Configuração

### Pré-requisitos

- Node.js 18+
- Angular CLI
- Backend PetShop rodando na porta 3000

### Instalação

```bash
npm install
```

## Ambientes Disponíveis

### 🚀 **Desenvolvimento (DEV)**
```bash
npm run start:dev
# ou
npm start
```
- **API URL**: `http://localhost:3000/api`
- **Identificação**: Badge "DEV" na interface

### 🧪 **QA (Quality Assurance)**
```bash
npm run start:qa
```
- **API URL**: `https://api-qa.petshopbrasil.com/api`
- **Identificação**: Badge "QA" na interface

### 🔍 **Homologação (HML)**
```bash
npm run start:hml
```
- **API URL**: `https://api-hml.petshopbrasil.com/api`
- **Identificação**: Badge "HML" na interface

### 🌐 **Produção (PRD)**
```bash
npm run start:prod
```
- **API URL**: `https://api.petshopbrasil.com/api`
- **Identificação**: Badge "PRODUÇÃO" na interface

## Build de Produção

### Para cada ambiente:
```bash
# Desenvolvimento
npm run build:dev

# QA
npm run build:qa

# Homologação
npm run build:hml

# Produção
npm run build:prod
```

## Sistema de Endpoints Centralizado

O projeto utiliza um sistema centralizado de endpoints localizado em `src/app/config/api-endpoints.ts` que organiza todos os endpoints da API por módulo:

### Módulos Disponíveis
- **AUTH**: Autenticação e gerenciamento de usuários
- **CLINICS**: Gerenciamento de clínicas e seleção
- **PETS**: Gerenciamento de pets
- **MEDICAL_RECORDS**: Prontuários médicos
- **FORM_TEMPLATES**: Templates de formulários
- **APPOINTMENTS**: Agendamentos
- **PRODUCTS**: Produtos e estoque
- **SERVICES**: Serviços veterinários
- **ORDERS**: Pedidos
- **VET_SETTINGS**: Configurações do veterinário
- **REPORTS**: Relatórios
- **DASHBOARD**: Dados do dashboard
- **NOTIFICATIONS**: Notificações
- **FILES**: Upload de arquivos

### Exemplo de Uso

```typescript
import { ApiEndpoints } from '../config/api-endpoints';

// Endpoints estáticos
const loginUrl = ApiEndpoints.AUTH.LOGIN;
const petsUrl = ApiEndpoints.PETS.LIST;

// Endpoints dinâmicos
const petByIdUrl = ApiEndpoints.PETS.BY_ID('123');
const userByIdUrl = ApiEndpoints.AUTH.USER_BY_ID('456');

// URLs customizadas
const customUrl = ApiEndpoints.buildUrl('/custom/endpoint');
```

## Fluxo de Autenticação

### 1. Login
1. Acesse `http://localhost:4200`
2. Você será redirecionado para a tela de login
3. Use as credenciais do backend:
   - Email: `admin@petshop.com`
   - Senha: `123456`

### 2. Seleção de Clínica
Após o login bem-sucedido:
- O usuário é redirecionado para `/clinic-select`
- Lista de clínicas associadas ao usuário é carregada
- Usuário seleciona uma clínica
- Sistema chama `/clinics/select` para confirmar seleção
- Clínica selecionada é armazenada no localStorage

### 3. Dashboard
Após selecionar a clínica:
- Usuário é redirecionado para `/dashboard`
- Dashboard mostra informações do usuário e da clínica selecionada
- Todas as operações subsequentes usam a clínica selecionada

### Segurança

- Tokens JWT são armazenados no localStorage
- Refresh automático de tokens expirados
- Logout automático em caso de erro 401
- Proteção de rotas com AuthGuard e ClinicGuard
- Dados da clínica são limpos ao fazer logout

## Integração com Backend

O frontend está configurado para consumir a API do backend com URLs específicas para cada ambiente através do sistema centralizado de endpoints.

### Endpoints Utilizados

- `POST /api/auth/login` - Login do usuário
- `POST /api/auth/refresh` - Refresh do token
- `POST /api/auth/logout` - Logout do usuário
- `GET /api/clinics/user` - Listar clínicas do usuário
- `POST /api/clinics/select` - Selecionar clínica

## Tecnologias Utilizadas

- Angular 20
- TypeScript
- Tailwind CSS
- RxJS
- Angular Router
- Angular Forms (Reactive Forms)

## Estrutura de Autenticação

### AuthService

Gerencia toda a lógica de autenticação:
- Login/logout
- Armazenamento de tokens
- Verificação de permissões
- Refresh automático de tokens
- Configurações de ambiente

### ClinicService

Gerencia operações relacionadas a clínicas:
- Listar clínicas do usuário
- Selecionar clínica
- Gerenciar dados da clínica

### AuthGuard

Protege rotas que requerem autenticação:
- Verifica se o usuário está logado
- Redireciona para login se não autenticado

### ClinicGuard

Protege rotas que requerem clínica selecionada:
- Verifica se há clínica selecionada
- Redireciona para seleção de clínica se necessário

### AuthInterceptor

Adiciona automaticamente o token JWT nas requisições HTTP:
- Intercepta todas as requisições
- Adiciona header Authorization
- Trata erros 401 com refresh automático

## Configuração de Ambientes

Cada ambiente possui:
- **Arquivo de configuração específico**
- **URLs de API diferentes**
- **Identificação visual na interface**
- **Scripts de build e serve específicos**

Para mais detalhes sobre a configuração de ambientes, consulte o arquivo [ENVIRONMENTS.md](./ENVIRONMENTS.md).

## Vantagens do Sistema Centralizado

- **Manutenibilidade**: Todos os endpoints em um local
- **Consistência**: Padrão uniforme para todas as URLs
- **Flexibilidade**: Fácil mudança de URLs por ambiente
- **Organização**: Endpoints agrupados por funcionalidade
- **Reutilização**: Métodos utilitários para URLs dinâmicas

## Próximos Passos

- [ ] Implementar registro de usuários
- [ ] Adicionar recuperação de senha
- [ ] Criar componentes para gerenciamento de pets
- [ ] Implementar agendamento de consultas
- [ ] Adicionar relatórios e dashboards
- [ ] Implementar notificações em tempo real
