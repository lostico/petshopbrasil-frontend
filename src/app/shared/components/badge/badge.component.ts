import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClasses">
      <svg
        *ngIf="icon"
        class="badge-icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
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
          *ngIf="icon === 'exclamation'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        ></path>
        <path
          *ngIf="icon === 'clock'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
        <path
          *ngIf="icon === 'user'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        ></path>
      </svg>
      {{ text }}
    </span>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    span {
      display: inline-flex;
      align-items: center;
      font-weight: 500;
      transition: all 0.2s;
      border-radius: 0.375rem;
      font-family: inherit;
    }

    /* Tamanhos */
    span.sm {
      padding: 0.125rem 0.5rem;
      font-size: 0.75rem;
    }

    span.md {
      padding: 0.25rem 0.625rem;
      font-size: 0.875rem;
    }

    span.lg {
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
    }

    /* Ícone */
    .badge-icon {
      margin-right: 0.25rem;
    }

    span.sm .badge-icon {
      width: 0.75rem;
      height: 0.75rem;
    }

    span.md .badge-icon {
      width: 1rem;
      height: 1rem;
    }

    span.lg .badge-icon {
      width: 1.25rem;
      height: 1.25rem;
    }

    /* Variantes preenchidas */
    span.primary {
      background-color: #dbeafe;
      color: #1e40af;
    }

    span.secondary {
      background-color: #f1f5f9;
      color: #475569;
    }

    span.success {
      background-color: #dcfce7;
      color: #166534;
    }

    span.warning {
      background-color: #fef3c7;
      color: #d97706;
    }

    span.danger {
      background-color: #fee2e2;
      color: #dc2626;
    }

    span.info {
      background-color: #dbeafe;
      color: #1e40af;
    }

    /* Variantes outline */
    span.outline-primary {
      background-color: transparent;
      border: 1px solid #93c5fd;
      color: #1e40af;
    }

    span.outline-secondary {
      background-color: transparent;
      border: 1px solid #cbd5e1;
      color: #475569;
    }

    span.outline-success {
      background-color: transparent;
      border: 1px solid #86efac;
      color: #166534;
    }

    span.outline-warning {
      background-color: transparent;
      border: 1px solid #fde047;
      color: #d97706;
    }

    span.outline-danger {
      background-color: transparent;
      border: 1px solid #fca5a5;
      color: #dc2626;
    }

    span.outline-info {
      background-color: transparent;
      border: 1px solid #93c5fd;
      color: #1e40af;
    }

    /* Bordas arredondadas */
    span.rounded {
      border-radius: 9999px;
    }
  `]
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'primary';
  @Input() size: BadgeSize = 'md';
  @Input() text = '';
  @Input() icon?: 'check' | 'x' | 'exclamation' | 'clock' | 'user';
  @Input() rounded = false;
  @Input() outlined = false;

  get badgeClasses(): string {
    const classes: string[] = [
      this.size,
      this.outlined ? `outline-${this.variant}` : this.variant
    ];

    if (this.rounded) {
      classes.push('rounded');
    }

    return classes.join(' ');
  }
}

