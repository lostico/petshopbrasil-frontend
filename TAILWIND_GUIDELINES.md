# Diretrizes para Uso do Tailwind CSS

## 🎯 Objetivo
Este documento estabelece as regras para utilização do Tailwind CSS no projeto, garantindo consistência, manutenibilidade e produtividade.

## 📋 Regras Principais

### 1. **Prioridade: Tailwind First**
- **SEMPRE** use classes do Tailwind CSS quando possível
- Só crie CSS customizado quando o Tailwind não atender a necessidade específica
- Evite duplicar funcionalidades que o Tailwind já oferece

### 2. **Quando Usar CSS Customizado**
- Animações complexas não disponíveis no Tailwind
- Estilos específicos de componentes únicos
- Integração com bibliotecas de terceiros
- Variáveis CSS customizadas para temas
- Estilos que precisam de JavaScript dinâmico

### 3. **Estrutura de Classes**
```html
<!-- ✅ Correto: Classes organizadas por categoria -->
<div class="
  flex items-center justify-between
  p-4 md:p-6
  bg-white rounded-lg shadow-md
  hover:shadow-lg transition-shadow
  border border-gray-200
">
```

### 4. **Responsividade**
```html
<!-- ✅ Use breakpoints do Tailwind -->
<div class="
  grid grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  xl:grid-cols-4 
  gap-4 md:gap-6
">
```

## 🎨 Padrões de Design

### Containers
```html
<!-- Container principal -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

<!-- Container de conteúdo -->
<div class="max-w-4xl mx-auto px-4 py-8">
```

### Botões
```html
<!-- Botão primário -->
<button class="
  bg-blue-600 hover:bg-blue-700 
  text-white font-medium 
  px-4 py-2 rounded-lg 
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
">

<!-- Botão secundário -->
<button class="
  bg-gray-200 hover:bg-gray-300 
  text-gray-800 font-medium 
  px-4 py-2 rounded-lg 
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
">
```

### Inputs
```html
<!-- Input padrão -->
<input class="
  w-full px-3 py-2 
  border border-gray-300 rounded-md 
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
  placeholder-gray-400
">

<!-- Input com ícone -->
<div class="relative">
  <input class="
    w-full pl-10 pr-3 py-2 
    border border-gray-300 rounded-md 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
  ">
  <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
    <!-- ícone -->
  </svg>
</div>
```

### Cards
```html
<!-- Card padrão -->
<div class="
  bg-white rounded-lg shadow-md 
  border border-gray-200 
  p-6 
  hover:shadow-lg transition-shadow
">
```

### Grids
```html
<!-- Grid responsivo -->
<div class="
  grid grid-cols-1 
  sm:grid-cols-2 
  lg:grid-cols-3 
  xl:grid-cols-4 
  gap-6
">
```

## 🚫 Anti-padrões

### ❌ Não faça:
```html
<!-- Evite classes muito longas em uma linha -->
<div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">

<!-- Evite CSS customizado para coisas simples -->
<style>
.container { max-width: 1200px; margin: 0 auto; } /* ❌ Use max-w-6xl mx-auto */
</style>
```

### ✅ Faça:
```html
<!-- Quebre classes longas em múltiplas linhas -->
<div class="
  flex items-center justify-between
  p-4 bg-white rounded-lg shadow-md
  hover:shadow-lg transition-shadow
  border border-gray-200
">

<!-- Use classes do Tailwind -->
<div class="max-w-6xl mx-auto"> <!-- ✅ -->
```

## 📁 Organização de Arquivos

### CSS Customizado Permitido
```css
/* ✅ Animações complexas */
@keyframes customAnimation {
  /* ... */
}

/* ✅ Estilos específicos de componentes */
.custom-component {
  /* Apenas quando Tailwind não atende */
}

/* ✅ Variáveis CSS para temas */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #6b7280;
}
```

### CSS Customizado Proibido
```css
/* ❌ Estilos que o Tailwind já oferece */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

/* ❌ Utilitários duplicados */
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

## 🔧 Configuração

### Extensões VSCode Recomendadas
- Tailwind CSS IntelliSense
- PostCSS Language Support

### Linting
- Configure o ESLint para detectar classes Tailwind não utilizadas
- Use o Prettier para formatar classes longas

## 📝 Checklist de Revisão

Antes de commitar, verifique:

- [ ] Todas as classes Tailwind estão sendo utilizadas?
- [ ] CSS customizado é realmente necessário?
- [ ] Classes estão organizadas e legíveis?
- [ ] Responsividade está implementada corretamente?
- [ ] Não há duplicação de funcionalidades?

## 🎯 Benefícios Esperados

1. **Consistência**: Todos os componentes seguem o mesmo padrão
2. **Produtividade**: Menos tempo escrevendo CSS
3. **Manutenibilidade**: Mudanças globais mais fáceis
4. **Performance**: CSS otimizado automaticamente
5. **Responsividade**: Breakpoints consistentes

## 📚 Recursos

- [Documentação Tailwind CSS](https://tailwindcss.com/docs)
- [Tailwind CSS Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)
- [Componentes Tailwind UI](https://tailwindui.com/)

---

**Lembre-se**: O objetivo é aproveitar ao máximo o Tailwind CSS, criando CSS customizado apenas quando absolutamente necessário.
