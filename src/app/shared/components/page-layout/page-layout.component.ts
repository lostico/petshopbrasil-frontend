import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent, PageHeaderAction } from '../page-header/page-header.component';

@Component({
  selector: 'app-page-layout',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <div class="min-h-screen bg-secondary-50 p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        @if (title) {
          <app-page-header
            [title]="title"
            [subtitle]="subtitle"
            [action]="action"
            (actionClick)="onActionClick()">
          </app-page-header>
        }
        
        <!-- Content -->
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: []
})
export class PageLayoutComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() action?: PageHeaderAction;
  
  @Output() actionClick = new EventEmitter<void>();

  onActionClick(): void {
    this.actionClick.emit();
  }
}
