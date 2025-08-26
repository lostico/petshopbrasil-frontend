import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { 
  ButtonComponent, 
  InputComponent, 
  CardComponent, 
  BadgeComponent, 
  AlertComponent 
} from '../index';

@Component({
  selector: 'app-showcase',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonComponent,
    InputComponent,
    CardComponent,
    BadgeComponent,
    AlertComponent
  ],
  template: `
    <div class="min-h-screen bg-secondary-50 p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-secondary-900 mb-2">
            Design System Showcase
          </h1>
          <p class="text-secondary-600">
            Demonstração de todos os componentes do design system
          </p>
        </div>

        <!-- Alerts Section -->
        <section class="mb-12">
          <h2 class="text-2xl font-semibold text-secondary-800 mb-6">Alertas</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <app-alert
              variant="success"
              title="Sucesso!"
              message="Operação realizada com sucesso."
              [dismissible]="true"
              (closed)="onAlertClose()">
            </app-alert>

            <app-alert
              variant="warning"
              title="Atenção"
              message="Esta ação não pode ser desfeita."
              [dismissible]="true">
            </app-alert>

            <app-alert
              variant="danger"
              title="Erro"
              message="Ocorreu um erro ao processar sua solicitação.">
            </app-alert>

            <app-alert
              variant="info"
              title="Informação"
              message="Nova funcionalidade disponível.">
            </app-alert>
          </div>
        </section>

        <!-- Buttons Section -->
        <section class="mb-12">
          <h2 class="text-2xl font-semibold text-secondary-800 mb-6">Botões</h2>
          
          <!-- Variants -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-secondary-700 mb-4">Variantes</h3>
            <div class="flex flex-wrap gap-4">
              <app-button label="Primário" variant="primary" (clicked)="onButtonClick()"></app-button>
              <app-button label="Secundário" variant="secondary" (clicked)="onButtonClick()"></app-button>
              <app-button label="Outline" variant="outline" (clicked)="onButtonClick()"></app-button>
              <app-button label="Ghost" variant="ghost" (clicked)="onButtonClick()"></app-button>
              <app-button label="Danger" variant="danger" (clicked)="onButtonClick()"></app-button>
            </div>
          </div>

          <!-- Sizes -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-secondary-700 mb-4">Tamanhos</h3>
            <div class="flex flex-wrap items-center gap-4">
              <app-button label="Pequeno" size="sm" variant="primary" (clicked)="onButtonClick()"></app-button>
              <app-button label="Médio" size="md" variant="primary" (clicked)="onButtonClick()"></app-button>
              <app-button label="Grande" size="lg" variant="primary" (clicked)="onButtonClick()"></app-button>
            </div>
          </div>

          <!-- With Icons -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-secondary-700 mb-4">Com Ícones</h3>
            <div class="flex flex-wrap gap-4">
              <app-button 
                label="Adicionar" 
                icon="plus" 
                variant="primary" 
                (clicked)="onButtonClick()">
              </app-button>
              <app-button 
                label="Editar" 
                icon="edit" 
                variant="secondary" 
                (clicked)="onButtonClick()">
              </app-button>
              <app-button 
                label="Excluir" 
                icon="trash" 
                variant="danger" 
                (clicked)="onButtonClick()">
              </app-button>
            </div>
          </div>

          <!-- States -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-secondary-700 mb-4">Estados</h3>
            <div class="flex flex-wrap gap-4">
                             <app-button 
                 label="Carregando..." 
                 [loading]="true" 
                 variant="primary">
               </app-button>
               <app-button 
                 label="Desabilitado" 
                 [disabled]="true" 
                 variant="primary">
               </app-button>
            </div>
          </div>
        </section>

        <!-- Inputs Section -->
        <section class="mb-12">
          <h2 class="text-2xl font-semibold text-secondary-800 mb-6">Inputs</h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Basic Inputs -->
            <div>
              <h3 class="text-lg font-medium text-secondary-700 mb-4">Básicos</h3>
              <div class="space-y-4">
                <app-input 
                  label="Nome" 
                  placeholder="Digite seu nome"
                  [(ngModel)]="formData.name">
                </app-input>

                <app-input 
                  label="Email" 
                  type="email" 
                  placeholder="seu@email.com"
                  [(ngModel)]="formData.email">
                </app-input>

                <app-input 
                  label="Telefone" 
                  type="tel" 
                  placeholder="(00) 00000-0000"
                  [(ngModel)]="formData.phone">
                </app-input>
              </div>
            </div>

            <!-- Inputs with Icons -->
            <div>
              <h3 class="text-lg font-medium text-secondary-700 mb-4">Com Ícones</h3>
              <div class="space-y-4">
                <app-input 
                  label="Buscar" 
                  type="search" 
                  leftIcon="search"
                  placeholder="Buscar..."
                  [(ngModel)]="formData.search">
                </app-input>

                <app-input 
                  label="Email" 
                  type="email" 
                  leftIcon="mail"
                  placeholder="seu@email.com"
                  [(ngModel)]="formData.emailWithIcon">
                </app-input>

                <app-input 
                  label="Senha" 
                  type="password" 
                  leftIcon="user"
                  rightIcon="eye"
                  placeholder="Digite sua senha"
                  [(ngModel)]="formData.password">
                </app-input>
              </div>
            </div>
          </div>

          <!-- Validation States -->
          <div class="mt-8">
            <h3 class="text-lg font-medium text-secondary-700 mb-4">Estados de Validação</h3>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <app-input 
                label="Campo Válido" 
                placeholder="Campo válido"
                [valid]="true"
                [(ngModel)]="formData.validField">
              </app-input>

              <app-input 
                label="Campo Inválido" 
                placeholder="Campo inválido"
                [invalid]="true"
                errorMessage="Este campo é obrigatório"
                [(ngModel)]="formData.invalidField">
              </app-input>
            </div>
          </div>
        </section>

        <!-- Cards Section -->
        <section class="mb-12">
          <h2 class="text-2xl font-semibold text-secondary-800 mb-6">Cards</h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Basic Card -->
            <app-card title="Card Básico" subtitle="Subtítulo do card">
              <p class="text-secondary-600">
                Este é um exemplo de card básico com título e subtítulo.
              </p>
            </app-card>

            <!-- Elevated Card -->
            <app-card 
              title="Card Elevado" 
              subtitle="Com sombra"
              variant="elevated"
              [hover]="true">
              <p class="text-secondary-600">
                Card com efeito de elevação e hover.
              </p>
            </app-card>

            <!-- Card with Actions -->
            <app-card 
              title="Card com Ações" 
              [headerActions]="true"
              variant="outlined">
              
              <div card-actions>
                <app-button label="Ação" icon="plus" size="sm" variant="primary"></app-button>
              </div>
              
              <p class="text-secondary-600">
                Card com ações no cabeçalho.
              </p>
            </app-card>
          </div>
        </section>

        <!-- Badges Section -->
        <section class="mb-12">
          <h2 class="text-2xl font-semibold text-secondary-800 mb-6">Badges</h2>
          
          <!-- Variants -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-secondary-700 mb-4">Variantes</h3>
            <div class="flex flex-wrap gap-4">
              <app-badge text="Primário" variant="primary"></app-badge>
              <app-badge text="Secundário" variant="secondary"></app-badge>
              <app-badge text="Sucesso" variant="success"></app-badge>
              <app-badge text="Aviso" variant="warning"></app-badge>
              <app-badge text="Erro" variant="danger"></app-badge>
              <app-badge text="Info" variant="info"></app-badge>
            </div>
          </div>

          <!-- Sizes -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-secondary-700 mb-4">Tamanhos</h3>
            <div class="flex flex-wrap items-center gap-4">
              <app-badge text="Pequeno" size="sm" variant="primary"></app-badge>
              <app-badge text="Médio" size="md" variant="primary"></app-badge>
              <app-badge text="Grande" size="lg" variant="primary"></app-badge>
            </div>
          </div>

          <!-- With Icons -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-secondary-700 mb-4">Com Ícones</h3>
            <div class="flex flex-wrap gap-4">
              <app-badge 
                text="Ativo" 
                icon="check" 
                variant="success">
              </app-badge>
              <app-badge 
                text="Em andamento" 
                icon="clock" 
                variant="warning">
              </app-badge>
              <app-badge 
                text="Usuário" 
                icon="user" 
                variant="info">
              </app-badge>
            </div>
          </div>

          <!-- Outlined -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-secondary-700 mb-4">Outline</h3>
            <div class="flex flex-wrap gap-4">
              <app-badge 
                text="Outline" 
                variant="primary" 
                [outlined]="true">
              </app-badge>
              <app-badge 
                text="Rounded" 
                variant="success" 
                [rounded]="true">
              </app-badge>
            </div>
          </div>
        </section>

        <!-- Form Example -->
        <section class="mb-12">
          <h2 class="text-2xl font-semibold text-secondary-800 mb-6">Exemplo de Formulário</h2>
          
          <app-card title="Formulário de Exemplo" subtitle="Demonstração de uso dos componentes">
            <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <app-input 
                  label="Nome Completo" 
                  placeholder="Digite seu nome completo"
                  formControlName="name">
                </app-input>

                <app-input 
                  label="Email" 
                  type="email" 
                  placeholder="seu@email.com"
                  formControlName="email">
                </app-input>

                <app-input 
                  label="Telefone" 
                  type="tel" 
                  placeholder="(00) 00000-0000"
                  formControlName="phone">
                </app-input>

                <app-input 
                  label="CPF" 
                  placeholder="000.000.000-00"
                  formControlName="cpf">
                </app-input>
              </div>

              <div class="flex gap-4">
                <app-button 
                  type="submit" 
                  label="Salvar" 
                  icon="check" 
                  variant="primary"
                  [loading]="loading">
                </app-button>
                
                <app-button 
                  type="button" 
                  label="Cancelar" 
                  variant="secondary"
                  (clicked)="onCancel()">
                </app-button>
              </div>
            </form>
          </app-card>
        </section>
      </div>
    </div>
  `,
  styles: []
})
export class ShowcaseComponent {
  formData = {
    name: '',
    email: '',
    phone: '',
    search: '',
    emailWithIcon: '',
    password: '',
    validField: 'Campo válido',
    invalidField: ''
  };

  exampleForm: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder) {
    this.exampleForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      cpf: ['', Validators.required]
    });
  }

  onButtonClick(): void {
    console.log('Botão clicado!');
  }

  onAlertClose(): void {
    console.log('Alerta fechado!');
  }

  onSubmit(): void {
    if (this.exampleForm.valid) {
      this.loading = true;
      console.log('Formulário enviado:', this.exampleForm.value);
      
      // Simular envio
      setTimeout(() => {
        this.loading = false;
        console.log('Formulário processado!');
      }, 2000);
    } else {
      console.log('Formulário inválido!');
    }
  }

  onCancel(): void {
    console.log('Cancelado!');
    this.exampleForm.reset();
  }
}
