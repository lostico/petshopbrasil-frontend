import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type HighlightCardVariant = 'default' | 'elevated' | 'outlined';
export type HighlightCardSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-highlight-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="highlight-card"
      [class]="cardClasses"
      [style.background-color]="backgroundColor"
      [style.border-color]="borderColor">
      
      <!-- Content -->
      <div class="card-content flex flex-col h-full">
        <ng-content></ng-content>
      </div>
      
      <!-- Footer -->
      @if (footerContent) {
        <div class="card-footer">
          <ng-content select="[footer]"></ng-content>
        </div>
      }
    </div>
  `,
  styles: [`
    .highlight-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .highlight-card:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .highlight-card.elevated {
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }

    .highlight-card.elevated:hover {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    .highlight-card.outlined {
      background: white;
      border: 2px solid #e5e7eb;
    }

    .highlight-card.outlined:hover {
      border-color: #d1d5db;
    }

    /* Sizes */
    .highlight-card.sm {
      padding: 16px;
    }

    .highlight-card.md {
      padding: 24px;
    }

    .highlight-card.lg {
      padding: 32px;
    }

    /* Content */
    .card-content {
      color: #1f2937;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    /* Footer */
    .card-footer {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .highlight-card.md {
        padding: 20px;
      }
      
      .highlight-card.lg {
        padding: 24px;
      }
    }
  `]
})
export class HighlightCardComponent {
  @Input() variant: HighlightCardVariant = 'default';
  @Input() size: HighlightCardSize = 'md';
  @Input() backgroundColor?: string;
  @Input() borderColor?: string;
  @Input() footerContent = false;

  get cardClasses(): string {
    const classes = ['highlight-card'];
    
    if (this.variant !== 'default') {
      classes.push(this.variant);
    }
    
    if (this.size !== 'md') {
      classes.push(this.size);
    }
    
    return classes.join(' ');
  }
}
