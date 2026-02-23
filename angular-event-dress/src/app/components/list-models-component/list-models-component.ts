import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelService } from '../../services/model-service';
import { ModelCardComponent } from '../model-card-component/model-card-component';
import { ModelModel } from '../../models/model.model';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
@Component({
  selector: 'app-list-models-component',
  standalone: true,
  imports: [CommonModule, ModelCardComponent, ProgressSpinnerModule, DataViewModule, ButtonModule, PaginatorModule],
  templateUrl: './list-models-component.html',
  styleUrl: './list-models-component.scss',
})
export class ListModelsComponent implements OnInit {

  private modelService = inject(ModelService);

  models = signal<ModelModel[]>([]);
  loading = signal(true);
  totalRecords = signal(0);
  rows = 8;

  ngOnInit(): void {
    this.modelService.getModels().subscribe({
      next: (data) => {
        this.models.set(data.items);
        this.totalRecords.set(data.totalCount);
        this.loading.set(false);
      }
    });
  }
}