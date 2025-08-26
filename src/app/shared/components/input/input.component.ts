import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date';
export type InputSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-input',
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
        <input
          [id]="id"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [attr.maxlength]="maxlength"
          [attr.minlength]="minlength"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          [class]="inputClasses"
        >
        
        <!-- Left Icon -->
        <div 
          *ngIf="leftIcon" 
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <svg 
            class="h-5 w-5 text-secondary-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              *ngIf="leftIcon === 'search'"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
            <path 
              *ngIf="leftIcon === 'mail'"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            ></path>
            <path 
              *ngIf="leftIcon === 'phone'"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            ></path>
            <path 
              *ngIf="leftIcon === 'user'"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
        </div>
        
        <!-- Right Icon -->
        <div 
          *ngIf="rightIcon" 
          class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
        >
          <svg 
            class="h-5 w-5 text-secondary-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              *ngIf="rightIcon === 'eye'"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
            <path 
              *ngIf="rightIcon === 'eye-off'"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
            ></path>
            <path 
              *ngIf="rightIcon === 'check'"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M5 13l4 4L19 7"
            ></path>
            <path 
              *ngIf="rightIcon === 'x'"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </div>
        
        <!-- Clear Button -->
        <button
          *ngIf="showClearButton && value"
          type="button"
          (click)="clearValue()"
          class="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <svg 
            class="h-5 w-5 text-secondary-400 hover:text-secondary-600" 
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
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  styles: [`
    :host {
      display: block;
    }

    input {
      font-family: inherit;
      border-color: #d1d5db !important;
    }

    /* Placeholder mais suave */
    input::placeholder {
      color: #9ca3af !important;
      opacity: 1;
    }

    /* Placeholder para Firefox */
    input::-moz-placeholder {
      color: #9ca3af !important;
      opacity: 1;
    }

    /* Placeholder para Edge */
    input::-ms-input-placeholder {
      color: #9ca3af !important;
    }
    
    /* Placeholder para campos de data */
    input[type="date"]::placeholder {
      color: #9ca3af !important;
      opacity: 1;
    }
    
    input[type="date"]::-webkit-datetime-edit-fields-wrapper {
      color: #9ca3af;
    }
    
    input[type="date"]::-webkit-datetime-edit-text {
      color: #9ca3af;
    }
    
    input[type="date"]::-webkit-datetime-edit-month-field,
    input[type="date"]::-webkit-datetime-edit-day-field,
    input[type="date"]::-webkit-datetime-edit-year-field {
      color: #9ca3af;
    }
    
    input[type="date"]::-webkit-calendar-picker-indicator {
      filter: invert(0.6);
    }

    /* Estado de erro mais suave */
    input.invalid,
    input.border-danger-300 {
      border-color: #fca5a5 !important;
      box-shadow: 0 0 0 1px #fca5a5 !important;
    }

    input.invalid:focus,
    input.border-danger-300:focus {
      border-color: #ef4444 !important;
      box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important;
    }

    /* Estado de sucesso */
    input.valid,
    input.border-success-300 {
      border-color: #86efac !important;
      box-shadow: 0 0 0 1px #86efac !important;
    }

    input.valid:focus,
    input.border-success-300:focus {
      border-color: #22c55e !important;
      box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2) !important;
    }

    /* Estado normal com foco */
    input:focus {
      border-color: #3b82f6 !important;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
    }

    /* Texto de erro */
    .error-text {
      color: #ef4444 !important;
    }
  `]
})
export class InputComponent implements ControlValueAccessor {
  @Input() id = '';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: InputType = 'text';
  @Input() size: InputSize = 'md';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() maxlength?: number;
  @Input() minlength?: number;
  @Input() leftIcon?: 'search' | 'mail' | 'phone' | 'user';
  @Input() rightIcon?: 'eye' | 'eye-off' | 'check' | 'x';
  @Input() showClearButton = false;
  @Input() helperText = '';
  @Input() errorMessage = '';
  @Input() valid = false;
  @Input() invalid = false;

  value = '';
  focused = false;

  // ControlValueAccessor implementation
  private onChange = (value: string) => {};
  private onTouched = () => {};

  get inputClasses(): string {
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

    // Padding for icons
    const paddingClasses = [];
    if (this.leftIcon) {
      paddingClasses.push('pl-10');
    }
    if (this.rightIcon || this.showClearButton) {
      paddingClasses.push('pr-10');
    }

    // State classes
    let stateClasses = 'focus:border-primary-500 focus:ring-primary-500';
    
    if (this.invalid) {
      stateClasses = 'border-danger-300 focus:border-danger-500 focus:ring-danger-500';
    } else if (this.valid) {
      stateClasses = 'border-success-300 focus:border-success-500 focus:ring-success-500';
    }

    return [
      ...baseClasses,
      sizeClasses[this.size],
      ...paddingClasses,
      stateClasses
    ].join(' ');
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
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

  clearValue(): void {
    this.value = '';
    this.onChange(this.value);
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
