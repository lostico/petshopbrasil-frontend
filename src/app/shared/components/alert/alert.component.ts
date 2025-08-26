import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertVariant = 'success' | 'warning' | 'danger' | 'info';
export type AlertSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="show"
      [class]="alertClasses"
      role="alert"
    >
      <!-- Icon -->
      <div class="alert-icon">
        <svg
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            *ngIf="variant === 'success'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
          <path
            *ngIf="variant === 'warning'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          ></path>
          <path
            *ngIf="variant === 'danger'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
          <path
            *ngIf="variant === 'info'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </div>

      <!-- Content -->
      <div class="alert-content">
        <h3 *ngIf="title" class="alert-title">{{ title }}</h3>
        <p *ngIf="message" class="alert-message">{{ message }}</p>
        <div *ngIf="description" class="alert-description" [innerHTML]="description"></div>
      </div>

      <!-- Close Button -->
      <button
        *ngIf="dismissible"
        type="button"
        (click)="onClose()"
        class="alert-close"
        aria-label="Fechar alerta"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>
  `,
  styles: []
})
export class AlertComponent {
  @Input() variant: AlertVariant = 'info';
  @Input() size: AlertSize = 'md';
  @Input() title = '';
  @Input() message = '';
  @Input() description = '';
  @Input() dismissible = false;
  @Input() show = true;

  @Output() closed = new EventEmitter<void>();

  get alertClasses(): string {
    const baseClasses = [
      'flex items-start',
      'rounded-lg',
      'border',
      'transition-all duration-200'
    ];

    // Size classes
    const sizeClasses = {
      sm: 'p-3 gap-2',
      md: 'p-4 gap-3',
      lg: 'p-6 gap-4'
    };

    // Variant classes
    const variantClasses = this.getVariantClasses();

    return [
      ...baseClasses,
      sizeClasses[this.size],
      ...variantClasses
    ].join(' ');
  }

  private getVariantClasses(): string[] {
    const variants = {
      success: [
        'bg-success-50',
        'border-success-200',
        'text-success-800'
      ],
      warning: [
        'bg-warning-50',
        'border-warning-200',
        'text-warning-800'
      ],
      danger: [
        'bg-danger-50',
        'border-danger-200',
        'text-danger-800'
      ],
      info: [
        'bg-blue-50',
        'border-blue-200',
        'text-blue-800'
      ]
    };

    return variants[this.variant] || variants.info;
  }

  onClose(): void {
    this.show = false;
    this.closed.emit();
  }
}

