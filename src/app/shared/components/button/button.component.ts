import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      (click)="onClick($event)"
      [class]="buttonClasses"
      [style]="buttonStyles"
    >
      <!-- Loading spinner -->
      <svg
        *ngIf="loading"
        [class]="getLoadingClasses()"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      
      <!-- Lucide Icons -->
      <lucide-icon 
        *ngIf="icon && !loading" 
        [name]="getLucideIconName()" 
        [class]="getIconClasses()">
      </lucide-icon>
      
      <span *ngIf="label">{{ label }}</span>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      border-radius: 0.5rem;
      transition: all 0.2s;
      cursor: pointer;
      border: none;
      outline: none;
      font-family: inherit;
    }

    button:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
    }

    /* Variantes */
    button.primary {
      background-color: #2563eb;
      color: white;
    }

    button.primary:hover:not(:disabled) {
      background-color: #1d4ed8;
      transform: translateY(-1px);
    }

    button.secondary {
      background-color: #f1f5f9;
      color: #475569;
    }

    button.secondary:hover:not(:disabled) {
      background-color: #e2e8f0;
    }

    button.outline {
      background-color: transparent;
      border: 2px solid #2563eb;
      color: #2563eb;
    }

    button.outline:hover:not(:disabled) {
      background-color: #eff6ff;
    }

    button.ghost {
      background-color: transparent;
      color: #64748b;
    }

    button.ghost:hover:not(:disabled) {
      background-color: #f8fafc;
      color: #475569;
    }

    button.danger {
      background-color: #dc2626;
      color: white;
    }

    button.danger:hover:not(:disabled) {
      background-color: #b91c1c;
      transform: translateY(-1px);
    }

    /* Tamanhos */
    button.sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
    }

    button.md {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }

    button.lg {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
    }

    /* Largura total */
    button.full-width {
      width: 100%;
    }
  `]
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() icon?: 'plus' | 'edit' | 'trash' | 'arrow-left' | 'arrow-right' | 'check' | 'x' | 'eye' | 'cog';
  @Input() label?: string;
  @Input() fullWidth = false;

  @Output() clicked = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    const classes: string[] = [
      this.variant,
      this.size
    ];

    if (this.fullWidth) {
      classes.push('full-width');
    }

    return classes.join(' ');
  }

  get buttonStyles(): string {
    return '';
  }

  getLucideIconName(): string {
    const iconMap: Record<string, string> = {
      'plus': 'plus',
      'edit': 'edit',
      'trash': 'trash-2',
      'arrow-left': 'arrow-left',
      'arrow-right': 'arrow-right',
      'check': 'check',
      'x': 'x',
      'eye': 'eye',
      'cog': 'settings'
    };
    return iconMap[this.icon || ''] || '';
  }

  getIconClasses(): string {
    const baseClasses = 'h-4 w-4';
    const spacingClass = this.label ? 'mr-2' : '';
    return `${baseClasses} ${spacingClass}`.trim();
  }

  getLoadingClasses(): string {
    const baseClasses = 'animate-spin -ml-1 h-4 w-4';
    const spacingClass = this.label ? 'mr-2' : '';
    return `${baseClasses} ${spacingClass}`.trim();
  }

  onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}

