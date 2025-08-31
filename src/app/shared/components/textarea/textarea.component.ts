import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

export type TextareaSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-group">
      <label 
        *ngIf="label" 
        [for]="id" 
        class="block text-sm font-medium text-secondary-700 mb-1"
      >
        {{ label }}
        <span *ngIf="required" class="text-danger-500">*</span>
      </label>
      
      <div class="relative">
        <textarea
          [id]="id"
          [rows]="rows"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [attr.maxlength]="maxlength"
          [attr.minlength]="minlength"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          [class]="textareaClasses"
        ></textarea>
        
        <!-- Character Counter -->
        <div 
          *ngIf="showCharacterCounter && maxlength" 
          class="absolute bottom-2 right-2 text-xs text-secondary-400 pointer-events-none"
        >
          {{ (value.length || 0) }}/{{ maxlength }}
        </div>
      </div>
      
      <!-- Helper Text -->
      <p 
        *ngIf="helperText" 
        class="mt-1 text-sm text-secondary-500"
      >
        {{ helperText }}
      </p>
      
      <!-- Error Message -->
      <p 
        *ngIf="errorMessage" 
        class="mt-1 text-sm error-text"
      >
        {{ errorMessage }}
      </p>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ],
  styles: [`
    :host {
      display: block;
    }

    textarea {
      font-family: inherit;
      border-color: #d1d5db !important;
      resize: vertical;
      min-height: 80px;
    }

    /* Placeholder mais suave */
    textarea::placeholder {
      color: #9ca3af !important;
      opacity: 1;
    }

    /* Placeholder para Firefox */
    textarea::-moz-placeholder {
      color: #9ca3af !important;
      opacity: 1;
    }

    /* Placeholder para Edge */
    textarea::-ms-input-placeholder {
      color: #9ca3af !important;
    }

    /* Estado de erro mais suave */
    textarea.invalid,
    textarea.border-danger-300 {
      border-color: #fca5a5 !important;
      box-shadow: 0 0 0 1px #fca5a5 !important;
    }

    textarea.invalid:focus,
    textarea.border-danger-300:focus {
      border-color: #ef4444 !important;
      box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important;
    }

    /* Estado de sucesso */
    textarea.valid,
    textarea.border-success-300 {
      border-color: #86efac !important;
      box-shadow: 0 0 0 1px #86efac !important;
    }

    textarea.valid:focus,
    textarea.border-success-300:focus {
      border-color: #22c55e !important;
      box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2) !important;
    }

    /* Estado normal com foco */
    textarea:focus {
      border-color: #3b82f6 !important;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
    }

    /* Texto de erro */
    .error-text {
      color: #ef4444 !important;
    }

    /* Desabilitar resize se necessário */
    textarea.no-resize {
      resize: none;
    }
  `]
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() id = '';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() size: TextareaSize = 'md';
  @Input() rows = 4;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() maxlength?: number;
  @Input() minlength?: number;
  @Input() showCharacterCounter = false;
  @Input() helperText = '';
  @Input() errorMessage = '';
  @Input() valid = false;
  @Input() invalid = false;
  @Input() noResize = false;

  value = '';
  focused = false;

  // ControlValueAccessor implementation
  private onChange = (value: string) => {};
  private onTouched = () => {};

  get textareaClasses(): string {
    const baseClasses = [
      'block w-full rounded-md',
      'border border-gray-300',
      'transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:bg-secondary-50 disabled:text-secondary-500',
      'disabled:cursor-not-allowed'
    ];

    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-3 text-base'
    };

    // Padding for character counter
    const paddingClasses = [];
    if (this.showCharacterCounter && this.maxlength) {
      paddingClasses.push('pb-8');
    }

    // State classes
    let stateClasses = 'focus:border-primary-500 focus:ring-primary-500';
    
    if (this.invalid) {
      stateClasses = 'border-danger-300 focus:border-danger-500 focus:ring-danger-500';
    } else if (this.valid) {
      stateClasses = 'border-success-300 focus:border-success-500 focus:ring-success-500';
    }

    // Resize classes
    const resizeClasses = this.noResize ? 'no-resize' : '';

    return [
      ...baseClasses,
      sizeClasses[this.size],
      ...paddingClasses,
      stateClasses,
      resizeClasses
    ].join(' ');
  }

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onFocus(): void {
    this.focused = true;
    this.onTouched();
  }

  onBlur(): void {
    this.focused = false;
    this.onTouched();
  }

  // ControlValueAccessor methods
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
