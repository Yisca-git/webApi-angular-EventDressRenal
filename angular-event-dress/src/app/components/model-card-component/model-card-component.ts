import { Component, Input } from '@angular/core';
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
  @Input() model!: ModelModel;
}
