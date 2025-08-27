import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      (click)="onClick($event)"
      [class]="buttonClasses"
      [style]="buttonStyles"
    >
      <svg
        *ngIf="loading"
        class="animate-spin -ml-1 mr-2 h-4 w-4"
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
      
      <svg
        *ngIf="icon && !loading"
        class="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          *ngIf="icon === 'plus'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 4v16m8-8H4"
        ></path>
        <path
          *ngIf="icon === 'edit'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        ></path>
        <path
          *ngIf="icon === 'trash'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        ></path>
        <path
          *ngIf="icon === 'arrow-left'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        ></path>
        <path
          *ngIf="icon === 'arrow-right'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M14 5l7 7m0 0l-7 7m7-7H3"
        ></path>
        <path
          *ngIf="icon === 'check'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 13l4 4L19 7"
        ></path>
        <path
          *ngIf="icon === 'x'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        ></path>
        <path
          *ngIf="icon === 'eye'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        ></path>
        <path
          *ngIf="icon === 'eye'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0z"
        ></path>
        <path
          *ngIf="icon === 'cog'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        ></path>
        <path
          *ngIf="icon === 'cog'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        ></path>
      </svg>
      
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

  onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}

