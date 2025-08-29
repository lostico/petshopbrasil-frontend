import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

export interface ModalAction {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
}

@Component({
  selector: 'app-modal-template',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          <button class="modal-close" (click)="onClose()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Conteúdo -->
        <div class="modal-body">
          <ng-content></ng-content>
        </div>

        <!-- Footer -->
        @if (showFooter && footerActions.length) {
          <div class="modal-footer">
            @for (action of footerActions; track action.label) {
              <app-button 
                [label]="action.label"
                [variant]="action.variant || 'primary'"
                [disabled]="action.disabled || false"
                [loading]="action.loading || false"
                (clicked)="action.onClick()">
              </app-button>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }

    .modal-container {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 0 24px;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 16px;
      flex-shrink: 0;
    }

    .modal-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #111827;
    }

    .modal-close {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      color: #6b7280;
      transition: all 0.2s;
    }

    .modal-close:hover {
      background-color: #f3f4f6;
      color: #374151;
    }

    .modal-body {
      padding: 24px;
      flex: 1;
      overflow-y: auto;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 24px;
      border-top: 1px solid #e5e7eb;
      background-color: #f9fafb;
      flex-shrink: 0;
    }

    /* Responsividade */
    @media (max-width: 640px) {
      .modal-overlay {
        padding: 0.5rem;
      }

      .modal-container {
        width: 100%;
        max-width: 100%;
        max-height: 100vh;
      }

      .modal-header {
        padding: 1rem 1rem 0 1rem;
      }

      .modal-body {
        padding: 1rem;
      }

      .modal-footer {
        padding: 0.75rem 1rem 1rem 1rem;
        flex-direction: column;
      }

      .modal-footer app-button {
        width: 100%;
      }
    }
  `]
})
export class ModalTemplateComponent {
  @Input() title = 'Título do Modal';
  @Input() showFooter = true;
  @Input() footerActions: ModalAction[] = [];
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
