import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pet, PetSpecies, PetGender, PetStatus } from '../../services/pet.service';

@Component({
  selector: 'app-pet-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pet-detail-modal.component.html',
  styleUrls: ['./pet-detail-modal.component.css']
})
export class PetDetailModalComponent {
  @Input() pet!: Pet;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Pet>();
  @Output() manageStatus = new EventEmitter<Pet>();

  PetSpecies = PetSpecies;
  PetGender = PetGender;

  getSpeciesLabel(species: PetSpecies): string {
    const labels = {
      [PetSpecies.DOG]: 'Cão',
      [PetSpecies.CAT]: 'Gato',
      [PetSpecies.BIRD]: 'Ave',
      [PetSpecies.FISH]: 'Peixe',
      [PetSpecies.RABBIT]: 'Coelho',
      [PetSpecies.HAMSTER]: 'Hamster',
      [PetSpecies.OTHER]: 'Outro'
    };
    return labels[species] || species;
  }

  getGenderLabel(gender: PetGender): string {
    return gender === PetGender.MALE ? 'Macho' : 'Fêmea';
  }

  getAge(birthDate?: string | Date): string {
    if (!birthDate) return 'N/A';
    
    const today = new Date();
    const birth = new Date(birthDate);
    const ageInMs = today.getTime() - birth.getTime();
    const ageInYears = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365.25));
    
    if (ageInYears === 0) {
      const ageInMonths = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 30.44));
      return `${ageInMonths} mes${ageInMonths !== 1 ? 'es' : ''}`;
    }
    
    return `${ageInYears} ano${ageInYears !== 1 ? 's' : ''}`;
  }

  getPetAvatar(pet: Pet): string {
    return pet.name.charAt(0).toUpperCase();
  }

  getPetAvatarColor(species: PetSpecies): string {
    const colors = {
      [PetSpecies.DOG]: '#3b82f6',
      [PetSpecies.CAT]: '#8b5cf6',
      [PetSpecies.BIRD]: '#10b981',
      [PetSpecies.FISH]: '#06b6d4',
      [PetSpecies.RABBIT]: '#f59e0b',
      [PetSpecies.HAMSTER]: '#ef4444',
      [PetSpecies.OTHER]: '#6b7280'
    };
    return colors[species] || '#6b7280';
  }

  getStatusColor(status: PetStatus): string {
    const colors = {
      [PetStatus.ACTIVE]: '#10b981',
      [PetStatus.INACTIVE]: '#f59e0b',
      [PetStatus.DECEASED]: '#ef4444',
      [PetStatus.ADOPTED]: '#8b5cf6',
      [PetStatus.LOST]: '#f97316',
      [PetStatus.UNDER_TREATMENT]: '#06b6d4',
      [PetStatus.QUARANTINE]: '#dc2626'
    };
    return colors[status] || '#6b7280';
  }

  getStatusLabel(status: PetStatus): string {
    const labels = {
      [PetStatus.ACTIVE]: 'Ativo',
      [PetStatus.INACTIVE]: 'Inativo',
      [PetStatus.DECEASED]: 'Falecido',
      [PetStatus.ADOPTED]: 'Adotado',
      [PetStatus.LOST]: 'Perdido',
      [PetStatus.UNDER_TREATMENT]: 'Em Tratamento',
      [PetStatus.QUARANTINE]: 'Quarentena'
    };
    return labels[status] || 'Desconhecido';
  }

  formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  }

  formatCPF(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  onClose(): void {
    this.close.emit();
  }

  onEdit(): void {
    this.edit.emit(this.pet);
  }

  onManageStatus(): void {
    this.manageStatus.emit(this.pet);
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}


