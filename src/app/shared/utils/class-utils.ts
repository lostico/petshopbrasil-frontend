/**
 * Utilitários para Gerenciamento de Classes CSS
 * 
 * Este arquivo fornece funções utilitárias para trabalhar com classes CSS
 * de forma mais organizada e type-safe.
 */

// ============================================================================
// TIPOS
// ============================================================================

export type ClassValue = string | number | boolean | null | undefined;
export type ClassArray = ClassValue[];
export type ClassObject = Record<string, ClassValue>;
export type ClassInput = ClassValue | ClassArray | ClassObject;

// ============================================================================
// FUNÇÕES PRINCIPAIS
// ============================================================================

/**
 * Combina múltiplas classes CSS de forma inteligente
 * @param inputs - Classes CSS para combinar
 * @returns String com classes combinadas
 */
export function classNames(...inputs: ClassInput[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string') {
      classes.push(input);
    } else if (typeof input === 'number') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      classes.push(classNames(...input));
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) {
          classes.push(key);
        }
      }
    }
  }

  return classes.filter(Boolean).join(' ');
}

/**
 * Cria um objeto de classes condicionais
 * @param conditions - Objeto com condições e classes
 * @returns String com classes aplicadas baseadas nas condições
 */
export function conditionalClasses(conditions: ClassObject): string {
  return classNames(conditions);
}

/**
 * Combina classes base com variantes
 * @param base - Classes base
 * @param variants - Objeto com variantes e suas classes
 * @param variant - Variante ativa
 * @returns String com classes combinadas
 */
export function variantClasses<T extends string>(
  base: string,
  variants: Record<T, string>,
  variant: T
): string {
  return classNames(base, variants[variant]);
}

/**
 * Combina classes base com tamanhos
 * @param base - Classes base
 * @param sizes - Objeto com tamanhos e suas classes
 * @param size - Tamanho ativo
 * @returns String com classes combinadas
 */
export function sizeClasses<T extends string>(
  base: string,
  sizes: Record<T, string>,
  size: T
): string {
  return classNames(base, sizes[size]);
}

// ============================================================================
// UTILITÁRIOS ESPECÍFICOS
// ============================================================================

/**
 * Cria classes para estados de componentes
 * @param base - Classes base
 * @param states - Estados do componente
 * @returns String com classes de estado
 */
export function stateClasses(
  base: string,
  states: {
    disabled?: boolean;
    loading?: boolean;
    active?: boolean;
    focused?: boolean;
    hover?: boolean;
  }
): string {
  return classNames(base, {
    'opacity-50 cursor-not-allowed': states.disabled,
    'animate-pulse': states.loading,
    'ring-2 ring-primary-500': states.active || states.focused,
    'hover:shadow-lg': states.hover,
  });
}

/**
 * Cria classes para validação de formulários
 * @param base - Classes base
 * @param validation - Estado de validação
 * @returns String com classes de validação
 */
export function validationClasses(
  base: string,
  validation: {
    valid?: boolean;
    invalid?: boolean;
    error?: string;
  }
): string {
  return classNames(base, {
    'border-success-300 focus:border-success-500 focus:ring-success-500': validation.valid,
    'border-danger-300 focus:border-danger-500 focus:ring-danger-500': validation.invalid,
  });
}

/**
 * Cria classes responsivas
 * @param classes - Classes para diferentes breakpoints
 * @returns String com classes responsivas
 */
export function responsiveClasses(classes: {
  base?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
}): string {
  return classNames(
    classes.base,
    {
      [`sm:${classes.sm}`]: classes.sm,
      [`md:${classes.md}`]: classes.md,
      [`lg:${classes.lg}`]: classes.lg,
      [`xl:${classes.xl}`]: classes.xl,
      [`2xl:${classes['2xl']}`]: classes['2xl'],
    }
  );
}

// ============================================================================
// HELPERS PARA COMPONENTES ESPECÍFICOS
// ============================================================================

/**
 * Cria classes para botões
 * @param variant - Variante do botão
 * @param size - Tamanho do botão
 * @param disabled - Se está desabilitado
 * @param loading - Se está carregando
 * @returns String com classes do botão
 */
export function buttonClasses(
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger',
  size: 'sm' | 'md' | 'lg',
  disabled = false,
  loading = false
): string {
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-medium rounded-lg',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
  ];

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantClasses = {
    primary: [
      'bg-primary-600 hover:bg-primary-700',
      'text-white',
      'focus:ring-primary-500',
      'hover:transform hover:-translate-y-0.5',
    ],
    secondary: [
      'bg-secondary-100 hover:bg-secondary-200',
      'text-secondary-800',
      'focus:ring-secondary-500',
    ],
    outline: [
      'bg-transparent border-2',
      'border-primary-600 text-primary-600',
      'hover:bg-primary-50',
      'focus:ring-primary-500',
    ],
    ghost: [
      'bg-transparent',
      'text-secondary-600 hover:text-secondary-800',
      'hover:bg-secondary-50',
      'focus:ring-secondary-500',
    ],
    danger: [
      'bg-danger-600 hover:bg-danger-700',
      'text-white',
      'focus:ring-danger-500',
      'hover:transform hover:-translate-y-0.5',
    ],
  };

  const stateClasses = {
    'opacity-50 cursor-not-allowed': disabled,
    'animate-pulse': loading,
  };

  return classNames(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    stateClasses
  );
}

/**
 * Cria classes para inputs
 * @param size - Tamanho do input
 * @param valid - Se é válido
 * @param invalid - Se é inválido
 * @param disabled - Se está desabilitado
 * @returns String com classes do input
 */
export function inputClasses(
  size: 'sm' | 'md' | 'lg',
  valid = false,
  invalid = false,
  disabled = false
): string {
  const baseClasses = [
    'block w-full rounded-md',
    'border border-secondary-300',
    'transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
  ];

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const stateClasses = {
    'focus:border-primary-500 focus:ring-primary-500': !valid && !invalid,
    'border-success-300 focus:border-success-500 focus:ring-success-500': valid,
    'border-danger-300 focus:border-danger-500 focus:ring-danger-500': invalid,
    'bg-secondary-50 text-secondary-500 cursor-not-allowed': disabled,
  };

  return classNames(baseClasses, sizeClasses[size], stateClasses);
}

// ============================================================================
// EXPORTS
// ============================================================================

export { classNames as cn };
export default classNames;
