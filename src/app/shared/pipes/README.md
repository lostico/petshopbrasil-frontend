# Pipes de Formatação - Design System

## 🎯 Objetivo

Criar pipes reutilizáveis para formatação de dados brasileiros, substituindo métodos customizados por soluções padronizadas e performáticas do Angular.

## 📦 Pipes Criadas

### **1. PhoneFormatPipe**
Formata números de telefone brasileiros.

**Nome**: `phoneFormat`

**Formatações Suportadas**:
- **10 dígitos**: `(11) 9999-9999`
- **11 dígitos**: `(11) 99999-9999`
- **8 dígitos**: `9999-9999` (sem DDD)
- **9 dígitos**: `99999-9999` (sem DDD)

**Uso**:
```html
<span>{{ customer.phone | phoneFormat }}</span>
```

**Exemplos**:
```typescript
// Input: "11999999999"
// Output: "(11) 99999-9999"

// Input: "1199999999"
// Output: "(11) 9999-9999"

// Input: "999999999"
// Output: "99999-9999"
```

### **2. CpfFormatPipe**
Formata CPF brasileiro.

**Nome**: `cpfFormat`

**Formatação**: `999.999.999-99`

**Uso**:
```html
<span>{{ customer.cpf | cpfFormat }}</span>
```

**Exemplo**:
```typescript
// Input: "12345678901"
// Output: "123.456.789-01"
```

### **3. CepFormatPipe**
Formata CEP brasileiro.

**Nome**: `cepFormat`

**Formatação**: `99999-999`

**Uso**:
```html
<span>{{ customer.zipCode | cepFormat }}</span>
```

**Exemplo**:
```typescript
// Input: "12345678"
// Output: "12345-678"
```

## 🔧 Como Usar

### **Importação**
```typescript
import { PhoneFormatPipe, CpfFormatPipe, CepFormatPipe } from '../../shared/pipes';

@Component({
  imports: [PhoneFormatPipe, CpfFormatPipe, CepFormatPipe],
  // ...
})
```

### **Uso no Template**
```html
<!-- Telefone -->
<span>{{ customer.phone | phoneFormat }}</span>

<!-- CPF -->
<span>{{ customer.cpf | cpfFormat }}</span>

<!-- CEP -->
<span>{{ customer.zipCode | cepFormat }}</span>
```

### **Uso Programático**
```typescript
export class MyComponent {
  constructor(
    private phoneFormatPipe: PhoneFormatPipe,
    private cpfFormatPipe: CpfFormatPipe,
    private cepFormatPipe: CepFormatPipe
  ) {}

  formatData() {
    const phone = this.phoneFormatPipe.transform('11999999999');
    const cpf = this.cpfFormatPipe.transform('12345678901');
    const cep = this.cepFormatPipe.transform('12345678');
  }
}
```

## ✅ Benefícios das Pipes

### **1. Performance**
- ✅ **Cache automático** pelo Angular
- ✅ **Detecção de mudanças** otimizada
- ✅ **Reutilização** de instâncias
- ✅ **Menos processamento** desnecessário

### **2. Reutilização**
- ✅ **Uma vez criada, usada em qualquer lugar**
- ✅ **Consistência** de formatação
- ✅ **Manutenção centralizada**
- ✅ **Fácil de testar**

### **3. Manutenibilidade**
- ✅ **Código mais limpo** nos componentes
- ✅ **Lógica de formatação isolada**
- ✅ **Fácil de modificar** e estender
- ✅ **Testes unitários** simples

### **4. Padronização**
- ✅ **Formatação consistente** em toda a aplicação
- ✅ **Regras de negócio** centralizadas
- ✅ **Fácil de documentar**
- ✅ **Onboarding** simplificado

## 📊 Comparação: Métodos vs Pipes

| **Aspecto** | **Métodos Customizados** | **Pipes** |
|-------------|-------------------------|-----------|
| **Performance** | Executado a cada ciclo | Cache automático |
| **Reutilização** | Duplicado em cada componente | Uma vez criada |
| **Manutenção** | Difícil de manter | Centralizada |
| **Testes** | Testar em cada componente | Testar uma vez |
| **Código** | Mais verboso | Mais limpo |
| **Consistência** | Variável | Garantida |

## 🧪 Testes das Pipes

### **PhoneFormatPipe**
```typescript
describe('PhoneFormatPipe', () => {
  let pipe: PhoneFormatPipe;

  beforeEach(() => {
    pipe = new PhoneFormatPipe();
  });

  it('should format 11-digit phone number', () => {
    expect(pipe.transform('11999999999')).toBe('(11) 99999-9999');
  });

  it('should format 10-digit phone number', () => {
    expect(pipe.transform('1199999999')).toBe('(11) 9999-9999');
  });

  it('should handle null values', () => {
    expect(pipe.transform(null)).toBe('');
  });
});
```

### **CpfFormatPipe**
```typescript
describe('CpfFormatPipe', () => {
  let pipe: CpfFormatPipe;

  beforeEach(() => {
    pipe = new CpfFormatPipe();
  });

  it('should format CPF correctly', () => {
    expect(pipe.transform('12345678901')).toBe('123.456.789-01');
  });

  it('should handle invalid CPF', () => {
    expect(pipe.transform('123456')).toBe('123456');
  });
});
```

### **CepFormatPipe**
```typescript
describe('CepFormatPipe', () => {
  let pipe: CepFormatPipe;

  beforeEach(() => {
    pipe = new CepFormatPipe();
  });

  it('should format CEP correctly', () => {
    expect(pipe.transform('12345678')).toBe('12345-678');
  });

  it('should handle invalid CEP', () => {
    expect(pipe.transform('12345')).toBe('12345');
  });
});
```

## 🔄 Refatoração Realizada

### **Antes (Métodos Customizados)**
```typescript
// No componente
formatCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

formatPhone(phone: string): string {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

// No template
<span>{{ formatCPF(customer.cpf) }}</span>
<span>{{ formatPhone(customer.phone) }}</span>
```

### **Depois (Pipes)**
```typescript
// No template
<span>{{ customer.cpf | cpfFormat }}</span>
<span>{{ customer.phone | phoneFormat }}</span>
```

## 📋 Checklist de Implementação

- [x] **Criar** PhoneFormatPipe
- [x] **Criar** CpfFormatPipe
- [x] **Criar** CepFormatPipe
- [x] **Criar** arquivo de índice
- [x] **Refatorar** modal de cliente
- [x] **Remover** métodos customizados
- [x] **Testar** build
- [x] **Documentar** uso

## 🚀 Próximos Passos

1. **Aplicar** pipes em outros componentes
2. **Criar** pipes para outros formatos (CNPJ, RG, etc.)
3. **Adicionar** validação nas pipes
4. **Criar** testes unitários
5. **Documentar** para a equipe

## ✅ Resultado Final

As pipes de formatação agora oferecem:
- ✅ **Performance otimizada** com cache automático
- ✅ **Reutilização total** em toda a aplicação
- ✅ **Código mais limpo** nos componentes
- ✅ **Manutenção centralizada**
- ✅ **Consistência garantida**
- ✅ **Fácil de testar** e debugar

**Conclusão**: As pipes de formatação melhoram significativamente a performance e manutenibilidade do código! 🎉
