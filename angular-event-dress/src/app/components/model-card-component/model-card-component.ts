import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ModelModel } from '../../models/model.model';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-model-card-component',
  imports: [CardModule, ButtonModule],
  templateUrl: './model-card-component.html',
  styleUrl: './model-card-component.scss',
})
export class ModelCardComponent {
  private router = inject(Router);
  
  @Input() model!: ModelModel;

  onImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
  }

  onCardClick() {
    console.log('Navigating to model:', this.model.id);
    this.router.navigate(['/model', this.model.id]);
  }
}
