import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModelModel } from '../models/model.model';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:44362/api/models';

  getModels(
    description?: string,
    minPrice?: number,
    maxPrice?: number,
    categoriesId: number[] = [],
    color?: string,
    position: number = 1,
    skip: number = 8
  ): Observable<{ items: ModelModel[], totalCount: number }> {
    let params: any = { position, skip };
    
    if (description) params.description = description;
    if (minPrice !== undefined) params.minPrice = minPrice;
    if (maxPrice !== undefined) params.maxPrice = maxPrice;
    if (color) params.color = color;
    if (categoriesId.length > 0) params.categoriesId = categoriesId;

    return this.http.get<{ items: ModelModel[], totalCount: number }>(this.apiUrl, { params });
  }
}
 