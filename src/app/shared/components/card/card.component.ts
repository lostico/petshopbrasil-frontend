import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'flat';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses">
      <!-- Header -->
      <div 
        *ngIf="header || showHeader" 
        class="card-header"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 *ngIf="title" class="card-title">{{ title }}</h3>
            <p *ngIf="subtitle" class="card-subtitle">{{ subtitle }}</p>
          </div>
          <div *ngIf="headerActions" class="card-actions">
            <ng-content select="[card-actions]"></ng-content>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="card-content">
        <ng-content></ng-content>
      </div>

      <!-- Footer -->
      <div 
        *ngIf="footer || showFooter" 
        class="card-footer"
      >
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  `,
  styles: []
})
export class CardComponent {
  @Input() variant: CardVariant = 'default';
  @Input() title = '';
  @Input() subtitle = '';
  @Input() header = false;
  @Input() footer = false;
  @Input() showHeader = false;
  @Input() showFooter = false;
  @Input() headerActions = false;
  @Input() padding = 'p-5';
  @Input() hover = false;

  get cardClasses(): string {
    const baseClasses = [
      'rounded-lg',
      'transition-all duration-200',
      this.padding
    ];

    // Variant classes
    const variantClasses = {
      default: [
        'bg-white',
        'shadow-sm'
      ],
      elevated: [
        'bg-white',
        'shadow-md',
        'hover:shadow-lg'
      ],
      outlined: [
        'bg-white',
        'border-2 border-secondary-200'
      ],
      flat: [
        'bg-secondary-50',
        'border border-secondary-100'
      ]
    };

    // Hover effect
    const hoverClasses = this.hover ? 'hover:shadow-lg hover:-translate-y-1' : '';

    return [
      ...baseClasses,
      ...variantClasses[this.variant],
      hoverClasses
    ].join(' ');
  }
}
