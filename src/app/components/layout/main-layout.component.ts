import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from './sidebar.component';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="min-h-screen bg-gray-50 flex">
      <!-- Sidebar -->
      <app-sidebar 
        [collapsed]="sidebarCollapsed"
        (collapsedChange)="onSidebarCollapsedChange($event)"
        (logoutEvent)="onLogout()"
      ></app-sidebar>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col" [class.ml-64]="!sidebarCollapsed" [class.ml-16]="sidebarCollapsed">
        <!-- Header -->
        <app-header (logoutEvent)="onLogout()"></app-header>

        <!-- Page Content -->
        <main class="flex-1 overflow-auto">
          <div class="py-6">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <!-- Page Content -->
              <div class="mt-6">
                <router-outlet></router-outlet>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: []
})
export class MainLayoutComponent implements OnInit {
  sidebarCollapsed = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSidebarState();
  }

  loadSidebarState(): void {
    const sidebarCollapsedState = localStorage.getItem('sidebarCollapsed');
    if (sidebarCollapsedState !== null) {
      this.sidebarCollapsed = JSON.parse(sidebarCollapsedState);
    }
  }

  onSidebarCollapsedChange(collapsed: boolean): void {
    this.sidebarCollapsed = collapsed;
  }

  onLogout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
