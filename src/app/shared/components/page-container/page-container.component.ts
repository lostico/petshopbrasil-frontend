import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-secondary-50 px-6">
      <div class="max-w-7xl mx-auto">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: []
})
export class PageContainerComponent {
  // Componente simples que apenas fornece a estrutura base
  // Não precisa de inputs ou outputs por enquanto
}
