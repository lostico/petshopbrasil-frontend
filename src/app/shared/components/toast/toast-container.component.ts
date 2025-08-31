import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { ToastComponent, ToastConfig } from './toast.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <app-toast
        *ngFor="let toast of toasts"
        [config]="toast"
        (close)="onToastClose($event)"
        class="animate-in slide-in-from-top-2 duration-300"
      ></app-toast>
    </div>
  `,
  styles: [`
    :host {
      pointer-events: none;
    }

    app-toast {
      pointer-events: auto;
    }

    /* Animações */
    .animate-in {
      animation-fill-mode: both;
    }

    .slide-in-from-top-2 {
      animation: slideInFromTop 0.3s ease-out;
    }

    @keyframes slideInFromTop {
      from {
        opacity: 0;
        transform: translateY(-100%);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Responsividade */
    @media (max-width: 640px) {
      .fixed.top-4.right-4 {
        top: 1rem;
        right: 1rem;
        left: 1rem;
        max-width: none;
      }
    }
  `]
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  toasts: ToastConfig[] = [];
  private destroy$ = new Subject<void>();

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toasts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(toasts => {
        this.toasts = toasts;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onToastClose(toastId: string): void {
    this.toastService.remove(toastId);
  }
}
