import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
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
        <select
          [id]="id"
          [disabled]="disabled"
          [value]="value"
          (change)="onSelectChange($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          [class]="selectClasses"
        >
          <option 
            *ngIf="placeholder" 
            value="" 
            disabled 
            selected
            class="text-secondary-400"
          >
            {{ placeholder }}
          </option>
          
          <option 
            *ngFor="let option of options" 
            [value]="option.value"
            [disabled]="option.disabled"
            class="text-secondary-900"
          >
            {{ option.label }}
          </option>
        </select>
        
        <!-- Chevron Icon -->
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg 
            class="h-5 w-5 text-secondary-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>
      
      <p 
        *ngIf="errorMessage" 
        class="mt-1 text-sm error-text"
      >
        {{ errorMessage }}
      </p>
    </div>
  `,
  styles: [`
    :host { display: block; }
    select { 
      font-family: inherit;
      border-color: #d1d5db !important;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
    }
    select:focus {
      border-color: #3b82f6 !important;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
    }
    select:disabled {
      background-color: #f9fafb;
      color: #6b7280;
      cursor: not-allowed;
    }
    .error-text {
      color: #ef4444 !important;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() id = '';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() size: SelectSize = 'md';
  @Input() options: SelectOption[] = [];
  @Input() errorMessage = '';
  @Input() invalid = false;
  @Input() valid = false;

  value: string | number = '';
  touched = false;

  onValueChange = (value: string | number) => {};
  onTouched = () => {};

  get selectClasses(): string {
    const baseClasses = [
      'block w-full rounded-md',
      'bg-white',
      'border border-gray-300',
      'transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:bg-secondary-50 disabled:text-secondary-500',
      'disabled:cursor-not-allowed',
      'pr-10'
    ];

    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-3 text-base'
    };
    
    baseClasses.push(sizeClasses[this.size]);

    // State classes
    if (this.invalid) {
      baseClasses.push('border-danger-300');
    } else if (this.valid) {
      baseClasses.push('border-success-300');
    }

    return baseClasses.join(' ');
  }

  writeValue(value: string | number): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onValueChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.onValueChange(this.value);
  }

  onBlur(): void {
    if (!this.touched) {
      this.touched = true;
      this.onTouched();
    }
  }

  onFocus(): void {
    // Focus handling if needed
  }
}
