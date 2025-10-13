import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { PageContainerComponent } from '../../shared/components/page-container/page-container.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

interface SelectedClinic {
  id: string;
  name: string;
  location: string;
  role: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PageContainerComponent, PageHeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: []
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  selectedClinic: SelectedClinic | null = null;
  environment = environment;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadSelectedClinic();
  }

  loadSelectedClinic(): void {
    const clinicData = localStorage.getItem('selectedClinic');
    if (clinicData) {
      try {
        this.selectedClinic = JSON.parse(clinicData);
      } catch (error) {
        console.error('Erro ao carregar dados da clínica:', error);
        localStorage.removeItem('selectedClinic');
      }
    }
  }
}
