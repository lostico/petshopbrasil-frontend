import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent, ButtonVariant, ButtonSize } from '../button/button.component';

export interface PageHeaderAction {
  label: string;
  icon?: 'plus' | 'edit' | 'trash' | 'arrow-left' | 'arrow-right' | 'check' | 'x' | 'eye' | 'cog';
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
}

export interface PageHeaderSecondaryAction {
  label: string;
  icon?: 'plus' | 'edit' | 'trash' | 'arrow-left' | 'arrow-right' | 'check' | 'x' | 'eye' | 'cog';
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
}

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-secondary-900 mb-2">{{ title }}</h1>
        @if (subtitle) {
          <p class="text-secondary-600">{{ subtitle }}</p>
        }
      </div>
      @if (action || secondaryAction) {
        <div class="flex items-center gap-3">
          @if (action) {
            <app-button
              [label]="action.label"
              [icon]="action.icon"
              [variant]="action.variant || 'primary'"
              [size]="action.size || 'md'"
              [disabled]="action.disabled || false"
              (clicked)="onActionClick()">
            </app-button>
          }
          @if (secondaryAction) {
            <app-button
              [label]="secondaryAction.label"
              [icon]="secondaryAction.icon"
              [variant]="secondaryAction.variant || 'secondary'"
              [size]="secondaryAction.size || 'md'"
              [disabled]="secondaryAction.disabled || false"
              (clicked)="onSecondaryActionClick()">
            </app-button>
          }
        </div>
      }
    </div>
  `,
  styles: []
})
export class PageHeaderComponent {
  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() action?: PageHeaderAction;
  @Input() secondaryAction?: PageHeaderSecondaryAction;
  
  @Output() actionClick = new EventEmitter<void>();
  @Output() secondaryActionClick = new EventEmitter<void>();

  onActionClick(): void {
    this.actionClick.emit();
  }

  onSecondaryActionClick(): void {
    this.secondaryActionClick.emit();
  }
}
