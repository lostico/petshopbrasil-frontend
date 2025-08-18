# Configuração de Ambientes - PetShop Brasil Frontend

Este documento descreve a configuração dos diferentes ambientes disponíveis no projeto.

## Ambientes Disponíveis

### 🚀 **Desenvolvimento (DEV)**
- **Arquivo**: `src/environments/environment.ts`
- **API URL**: `http://localhost:3000/api`
- **Descrição**: Ambiente local para desenvolvimento
- **Comando**: `npm run start:dev` ou `npm start`

### 🧪 **QA (Quality Assurance)**
- **Arquivo**: `src/environments/environment.qa.ts`
- **API URL**: `https://api-qa.petshopbrasil.com/api`
- **Descrição**: Ambiente de testes e qualidade
- **Comando**: `npm run start:qa`

### 🔍 **Homologação (HML)**
- **Arquivo**: `src/environments/environment.hml.ts`
- **API URL**: `https://api-hml.petshopbrasil.com/api`
- **Descrição**: Ambiente de homologação e validação
- **Comando**: `npm run start:hml`

### 🌐 **Produção (PRD)**
- **Arquivo**: `src/environments/environment.prod.ts`
- **API URL**: `https://api.petshopbrasil.com/api`
- **Descrição**: Ambiente de produção
- **Comando**: `npm run start:prod`

## Scripts Disponíveis

### Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento
npm run start:dev

# Build para desenvolvimento
npm run build:dev
```

### QA
```bash
# Iniciar servidor QA
npm run start:qa

# Build para QA
npm run build:qa
```

### Homologação
```bash
# Iniciar servidor de homologação
npm run start:hml

# Build para homologação
npm run build:hml
```

### Produção
```bash
# Iniciar servidor de produção
npm run start:prod

# Build para produção
npm run build:prod
```

## Estrutura dos Arquivos de Ambiente

Cada arquivo de ambiente contém:

```typescript
export const environment = {
  production: boolean,        // Indica se é ambiente de produção
  apiUrl: string,            // URL base da API
  appName: string            // Nome da aplicação para o ambiente
};
```

## Sistema de Endpoints Centralizado

O projeto utiliza um sistema centralizado de endpoints localizado em `src/app/config/api-endpoints.ts` que:

- **Centraliza todos os endpoints** da API em um único local
- **Utiliza a URL base** do ambiente configurado
- **Organiza endpoints por módulo** (Auth, Pets, Medical Records, etc.)
- **Fornece métodos utilitários** para construção de URLs dinâmicas

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

### Módulos de Endpoints Disponíveis

- **AUTH**: Autenticação e gerenciamento de usuários
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

## Identificação Visual

Cada ambiente possui uma identificação visual:

- **DEV**: Badge azul com "DEV"
- **QA**: Badge azul com "QA"  
- **HML**: Badge azul com "HML"
- **PRD**: Badge azul com "PRODUÇÃO"

## Configuração do Angular

O arquivo `angular.json` foi configurado com:

- **File Replacements**: Substituição automática do arquivo de ambiente
- **Configurações específicas**: Para cada ambiente (budgets, otimizações, etc.)
- **Build targets**: Configurações de build otimizadas para cada ambiente

## Variáveis de Ambiente

### Desenvolvimento
```typescript
{
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'PetShop Brasil - Dev'
}
```

### QA
```typescript
{
  production: false,
  apiUrl: 'https://api-qa.petshopbrasil.com/api',
  appName: 'PetShop Brasil - QA'
}
```

### Homologação
```typescript
{
  production: false,
  apiUrl: 'https://api-hml.petshopbrasil.com/api',
  appName: 'PetShop Brasil - Homologação'
}
```

### Produção
```typescript
{
  production: true,
  apiUrl: 'https://api.petshopbrasil.com/api',
  appName: 'PetShop Brasil'
}
```

## Uso no Código

### Usando Endpoints Centralizados

```typescript
import { ApiEndpoints } from '../config/api-endpoints';

// Em um serviço
export class PetService {
  constructor(private http: HttpClient) {}

  getPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(ApiEndpoints.PETS.LIST);
  }

  getPetById(id: string): Observable<Pet> {
    return this.http.get<Pet>(ApiEndpoints.PETS.BY_ID(id));
  }
}
```

### Usando Configurações de Ambiente

```typescript
import { environment } from '../../environments/environment';

// Exemplo de uso
console.log('API URL:', environment.apiUrl);
console.log('App Name:', environment.appName);
```

## Deploy

### Desenvolvimento
```bash
npm run build:dev
# Arquivos gerados em dist/petshopbrasil-frontend/
```

### QA
```bash
npm run build:qa
# Arquivos otimizados para QA
```

### Homologação
```bash
npm run build:hml
# Arquivos otimizados para homologação
```

### Produção
```bash
npm run build:prod
# Arquivos otimizados para produção
```

## Segurança

- **Desenvolvimento**: Sem otimizações, com source maps
- **QA/HML**: Otimizações básicas, sem source maps
- **Produção**: Máxima otimização, sem source maps, com hash nos arquivos

## Monitoramento

Cada ambiente pode ser identificado através de:

1. **Badge visual** na interface
2. **Nome da aplicação** no header
3. **Informações do ambiente** no dashboard
4. **URLs específicas** para cada ambiente

## Vantagens do Sistema Centralizado

- **Manutenibilidade**: Todos os endpoints em um local
- **Consistência**: Padrão uniforme para todas as URLs
- **Flexibilidade**: Fácil mudança de URLs por ambiente
- **Organização**: Endpoints agrupados por funcionalidade
- **Reutilização**: Métodos utilitários para URLs dinâmicas
