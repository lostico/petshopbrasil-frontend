import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface ToastConfig {
  id: string;
  title: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
  position?: ToastPosition;
  showCloseButton?: boolean;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      [class]="toastClasses"
      class="toast-container"
    >
      <div class="flex items-start">
        <!-- Ícone -->
        <div class="flex-shrink-0">
          <svg 
            [class]="iconClasses"
            class="h-5 w-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <!-- Success Icon -->
            <path 
              *ngIf="config.variant === 'success'"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M5 13l4 4L19 7"
            ></path>
            
            <!-- Error Icon -->
            <path 
              *ngIf="config.variant === 'error'"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M6 18L18 6M6 6l12 12"
            ></path>
            
            <!-- Warning Icon -->
            <path 
              *ngIf="config.variant === 'warning'"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            ></path>
            
            <!-- Info Icon -->
            <path 
              *ngIf="config.variant === 'info'"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>

        <!-- Conteúdo -->
        <div class="ml-3 flex-1">
          <p *ngIf="config.title" class="text-sm font-medium text-gray-900">
            {{ config.title }}
          </p>
          <p class="text-sm text-gray-500">
            {{ config.message }}
          </p>
        </div>

        <!-- Botão Fechar -->
        <div *ngIf="config.showCloseButton !== false" class="ml-4 flex-shrink-0">
          <button
            type="button"
            (click)="onClose()"
            class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Barra de Progresso -->
      <div 
        *ngIf="config.duration && config.duration > 0"
        class="absolute bottom-0 left-0 h-1 bg-current opacity-20 transition-all duration-300"
        [style.width.%]="progressWidth"
      ></div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: relative;
      overflow: hidden;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .toast-container.success {
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      border-color: #10b981;
    }

    .toast-container.error {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      border-color: #ef4444;
    }

    .toast-container.warning {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border-color: #f59e0b;
    }

    .toast-container.info {
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      border-color: #3b82f6;
    }

    .toast-container.success .text-gray-900 {
      color: #065f46;
    }

    .toast-container.error .text-gray-900 {
      color: #991b1b;
    }

    .toast-container.warning .text-gray-900 {
      color: #92400e;
    }

    .toast-container.info .text-gray-900 {
      color: #1e40af;
    }

    .toast-container.success .text-gray-500 {
      color: #047857;
    }

    .toast-container.error .text-gray-500 {
      color: #dc2626;
    }

    .toast-container.warning .text-gray-500 {
      color: #d97706;
    }

    .toast-container.info .text-gray-500 {
      color: #2563eb;
    }
  `]
})
export class ToastComponent {
  @Input() config!: ToastConfig;
  @Output() close = new EventEmitter<string>();

  progressWidth = 100;
  private progressInterval: any;

  ngOnInit(): void {
    this.startProgress();
  }

  ngOnDestroy(): void {
    this.stopProgress();
  }

  private startProgress(): void {
    if (this.config.duration && this.config.duration > 0) {
      const startTime = Date.now();
      const duration = this.config.duration;

      this.progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        this.progressWidth = Math.max(0, 100 - (elapsed / duration) * 100);

        if (elapsed >= duration) {
          this.onClose();
        }
      }, 10);
    }
  }

  private stopProgress(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }

  onClose(): void {
    this.stopProgress();
    this.close.emit(this.config.id);
  }

  get toastClasses(): string {
    const baseClasses = 'p-4 max-w-sm w-full';
    const variantClasses = {
      success: 'success',
      error: 'error',
      warning: 'warning',
      info: 'info'
    };

    return `${baseClasses} ${variantClasses[this.config.variant]}`;
  }

  get iconClasses(): string {
    const baseClasses = 'h-5 w-5';
    const variantClasses = {
      success: 'text-green-600',
      error: 'text-red-600',
      warning: 'text-yellow-600',
      info: 'text-blue-600'
    };

    return `${baseClasses} ${variantClasses[this.config.variant]}`;
  }
}
