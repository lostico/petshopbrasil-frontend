import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

export interface ModalConfig {
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  showFooter?: boolean;
  footerActions?: ModalAction[];
}

export interface ModalAction {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    @if (isOpen) {
      <div 
        class="modal-overlay" 
        [class]="overlayClasses"
        (click)="onOverlayClick($event)"
      >
        <div 
          class="modal-container" 
          [class]="containerClasses"
          (click)="$event.stopPropagation()"
        >
        <!-- Header -->
        @if (config.title || config.showCloseButton !== false) {
          <div class="modal-header">
            @if (config.title) {
              <h2 class="modal-title">{{ config.title }}</h2>
            }
            @if (config.showCloseButton !== false) {
              <button 
                class="modal-close"
                (click)="onClose()"
                type="button"
                aria-label="Fechar modal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            }
          </div>
        }

        <!-- Body -->
        <div class="modal-body">
          <ng-content></ng-content>
        </div>

        <!-- Footer -->
        @if (config.showFooter && config.footerActions?.length) {
          <div class="modal-footer">
            @for (action of config.footerActions; track action.label) {
              <app-button
                [label]="action.label"
                [variant]="action.variant || 'primary'"
                [size]="action.size || 'md'"
                [disabled]="action.disabled || false"
                [loading]="action.loading || false"
                (clicked)="action.onClick()"
              >
              </app-button>
            }
          </div>
        }
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }

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
      border-radius: 0.75rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      max-width: 90vw;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    /* Tamanhos */
    .size-sm {
      width: 400px;
    }

    .size-md {
      width: 600px;
    }

    .size-lg {
      width: 800px;
    }

    .size-xl {
      width: 1000px;
    }

    .size-full {
      width: 95vw;
      height: 95vh;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem 1.5rem 0 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
    }

    .modal-close {
      background: none;
      border: none;
      color: #6b7280;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.375rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-close:hover {
      background-color: #f3f4f6;
      color: #374151;
    }

    .modal-body {
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
    }

    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.5rem 1.5rem 1.5rem;
      border-top: 1px solid #e5e7eb;
      background-color: #f9fafb;
    }

    /* Animações CSS */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from { 
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
      }
      to { 
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .modal-overlay {
      animation: fadeIn 0.3s ease-out;
    }

    .modal-container {
      animation: slideIn 0.3s ease-out;
    }

    /* Transições suaves */
    .modal-close {
      transition: all 0.2s ease;
    }

    .modal-close:hover {
      transform: scale(1.1);
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
export class ModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() config: ModalConfig = {};
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  overlayClasses = '';
  containerClasses = '';

  ngOnInit(): void {
    this.updateClasses();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.updateClasses();
    }
  }

  ngOnDestroy(): void {
    // Cleanup se necessário
  }

  private updateClasses(): void {
    this.overlayClasses = 'modal-overlay';
    this.containerClasses = `modal-container size-${this.config.size || 'md'}`;
  }

  onOverlayClick(event: Event): void {
    if (this.config.closeOnOverlayClick !== false) {
      this.onClose();
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
