import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ClinicSelectComponent } from './components/clinic-select/clinic-select.component';
import { MainLayoutComponent } from './components/layout/main-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CustomersComponent } from './components/customers/customers.component';
import { CustomerFormComponent } from './components/customers/customer-form/customer-form.component';
import { PetsComponent } from './components/pets/pets.component';
import { PetFormComponent } from './components/pets/pet-form/pet-form.component';
import { AuthGuard } from './guards/auth.guard';
import { ClinicGuard } from './guards/clinic.guard';
import { LoginGuard } from './guards/login.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  {
    path: 'clinic-select',
    component: ClinicSelectComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard, ClinicGuard],
    children: [
      // Dashboard
      { path: 'dashboard', component: DashboardComponent },
      
      // Vendas & Atendimento
      { path: 'pos', component: DashboardComponent }, // PDV
      { path: 'orders', component: DashboardComponent }, // Pedidos
      { path: 'crm/customers', component: CustomersComponent }, // Clientes
      { path: 'crm/customers/new', component: CustomerFormComponent }, // Novo Cliente
      { path: 'crm/customers/edit/:id', component: CustomerFormComponent }, // Editar Cliente
      { path: 'crm/pets', component: PetsComponent }, // Pets
      { path: 'crm/pets/new/:tutorId', component: PetFormComponent }, // Novo Pet com tutor específico
      { path: 'crm/pets/new', component: PetFormComponent }, // Novo Pet (sem tutor específico)
      { path: 'crm/pets/edit/:id', component: PetFormComponent }, // Editar Pet
      { path: 'schedule', component: DashboardComponent }, // Agendamentos
      { path: 'checkin', component: DashboardComponent }, // Check-in/out
      
      // Serviços
      { path: 'grooming', component: DashboardComponent }, // Banho & Tosa
      { path: 'vet', component: DashboardComponent }, // Veterinário
      { path: 'inpatient', component: DashboardComponent }, // Internação
      { path: 'hotel', component: DashboardComponent }, // Hotel
      
      // Produtos & Estoque
      { path: 'catalog', component: DashboardComponent }, // Catálogo
      { path: 'inventory', component: DashboardComponent }, // Estoque
      { path: 'purchasing', component: DashboardComponent }, // Compras
      
      // Financeiro
      { path: 'finance/cash', component: DashboardComponent }, // Caixa
      { path: 'finance/receivables', component: DashboardComponent }, // Recebíveis
      { path: 'finance/payables', component: DashboardComponent }, // Pagamentos
      
      // Relatórios
      { path: 'reports', component: DashboardComponent }, // Relatórios Gerais
      
                   // Configurações
             { path: 'settings/org', component: DashboardComponent }, // Empresa
             { path: 'settings/users', component: DashboardComponent }, // Usuários
             { path: 'settings/schedule', component: DashboardComponent }, // Agenda
             { path: 'settings/permissions', component: DashboardComponent }, // Permissões
      
      // Default redirect
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
