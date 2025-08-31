import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TextareaComponent } from './textarea.component';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-textarea-showcase',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextareaComponent, CardComponent],
  template: `
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Textarea Component Showcase</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Exemplos Básicos -->
        <app-card>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Exemplos Básicos</h2>
          
          <div class="space-y-6">
            <!-- Textarea básico -->
            <div>
              <h3 class="text-lg font-medium text-gray-800 mb-3">Textarea Básico</h3>
              <app-textarea
                id="basic"
                label="Descrição"
                placeholder="Digite sua descrição aqui..."
                [rows]="3">
              </app-textarea>
            </div>

            <!-- Com contador de caracteres -->
            <div>
              <h3 class="text-lg font-medium text-gray-800 mb-3">Com Contador de Caracteres</h3>
                              <app-textarea
                  id="with-counter"
                  label="Biografia"
                  placeholder="Conte um pouco sobre você..."
                  [maxlength]="200"
                  [showCharacterCounter]="true"
                  [rows]="4">
                </app-textarea>
            </div>

            <!-- Diferentes tamanhos -->
            <div>
              <h3 class="text-lg font-medium text-gray-800 mb-3">Diferentes Tamanhos</h3>
              <div class="space-y-4">
                <app-textarea
                  id="small"
                  label="Resumo (Pequeno)"
                  size="sm"
                  [rows]="2"
                  placeholder="Resumo curto...">
                </app-textarea>
                
                <app-textarea
                  id="medium"
                  label="Descrição (Médio)"
                  size="md"
                  [rows]="4"
                  placeholder="Descrição padrão...">
                </app-textarea>
                
                <app-textarea
                  id="large"
                  label="Conteúdo (Grande)"
                  size="lg"
                  [rows]="6"
                  placeholder="Conteúdo extenso...">
                </app-textarea>
              </div>
            </div>
          </div>
        </app-card>

        <!-- Estados e Validação -->
        <app-card>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Estados e Validação</h2>
          
          <div class="space-y-6">
            <!-- Formulário com validação -->
            <div>
              <h3 class="text-lg font-medium text-gray-800 mb-3">Formulário com Validação</h3>
              <form [formGroup]="form" class="space-y-4">
                <app-textarea
                  id="required"
                  label="Comentário *"
                  placeholder="Digite seu comentário..."
                  formControlName="comment"
                  [invalid]="!!(form.get('comment')?.invalid && form.get('comment')?.touched)"
                  [errorMessage]="getErrorMessage('comment')"
                  [rows]="3">
                </app-textarea>
                
                <app-textarea
                  id="with-limit"
                  label="Resumo (máx. 100 chars)"
                  placeholder="Resumo curto..."
                  [maxlength]="100"
                  [showCharacterCounter]="true"
                  formControlName="summary"
                  [invalid]="!!(form.get('summary')?.invalid && form.get('summary')?.touched)"
                  [errorMessage]="getErrorMessage('summary')"
                  [rows]="2">
                </app-textarea>
                
                <div class="flex space-x-4">
                  <button
                    type="button"
                    (click)="validateForm()"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Validar
                  </button>
                  <button
                    type="button"
                    (click)="resetForm()"
                    class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                    Limpar
                  </button>
                </div>
              </form>
            </div>

            <!-- Estados especiais -->
            <div>
              <h3 class="text-lg font-medium text-gray-800 mb-3">Estados Especiais</h3>
              
              <div class="space-y-4">
                <!-- Desabilitado -->
                <app-textarea
                  id="disabled"
                  label="Campo Desabilitado"
                  [disabled]="true"
                  value="Este campo não pode ser editado"
                  [rows]="2">
                </app-textarea>
                
                <!-- Somente leitura -->
                <app-textarea
                  id="readonly"
                  label="Campo Somente Leitura"
                  [readonly]="true"
                  value="Este campo é somente leitura"
                  [rows]="2">
                </app-textarea>
                
                <!-- Sem redimensionamento -->
                <app-textarea
                  id="no-resize"
                  label="Sem Redimensionamento"
                  [noResize]="true"
                  placeholder="Este textarea não pode ser redimensionado..."
                  [rows]="3">
                </app-textarea>
              </div>
            </div>
          </div>
        </app-card>
      </div>

      <!-- Resultado do Formulário -->
      <app-card class="mt-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Resultado do Formulário</h2>
        <div class="bg-gray-50 p-4 rounded-md">
          <pre class="text-sm text-gray-700">{{ form.value | json }}</pre>
        </div>
      </app-card>
    </div>
  `
})
export class TextareaShowcaseComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(10)]],
      summary: ['', [Validators.maxLength(100)]]
    });
  }

  validateForm(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  resetForm(): void {
    this.form.reset();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control?.errors || !control.touched) return '';

    if (control.errors['required']) {
      return 'Este campo é obrigatório';
    }
    if (control.errors['minlength']) {
      return `Mínimo de ${control.errors['minlength'].requiredLength} caracteres`;
    }
    if (control.errors['maxlength']) {
      return `Máximo de ${control.errors['maxlength'].requiredLength} caracteres`;
    }

    return '';
  }
}
