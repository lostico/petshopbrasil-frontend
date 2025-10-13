import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { CardComponent } from '../card/card.component';
import { PageContainerComponent } from '../page-container/page-container.component';
import { PageHeaderComponent } from '../page-header/page-header.component';

@Component({
  selector: 'app-showcase',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardComponent, PageContainerComponent, PageHeaderComponent],
  templateUrl: './showcase.component.html'
})
export class ShowcaseComponent {}
