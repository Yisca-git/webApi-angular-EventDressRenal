import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

import { ModelModel } from '../../models/model.model';
import { ModelService } from '../../services/model-service';
import { DressService } from '../../services/dress-service';
import { DressModel } from '../../models/dress.model';
import { CartService } from '../../services/cart-service';
import { UserService } from '../../services/user-service';


@Component({
  selector: 'app-model-page-component',
  standalone: true,
  imports: [CommonModule, ButtonModule, SelectModule, DatePickerModule, FormsModule],
  templateUrl: './model-page-component.html',
  styleUrls: ['./model-page-component.scss'],
})
export class ModelPageComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private modelService = inject(ModelService);
  private cdr = inject(ChangeDetectorRef);
  private dressService = inject(DressService);
  public cartService = inject(CartService);
  private userService = inject(UserService);
  invalidDate: boolean = false;
  model?: ModelModel;
  sizes: string[] = [];
  selectedSize: string | null = null;
  selectedDate: Date | null = null;
  minDate: Date = new Date();
  isAvailable: boolean = false;
  availabilityChecked: boolean = false;
  dress?: DressModel;
  loadingAvailability: boolean = false;
  isAdmin: boolean = false; 
ngOnInit(): void {
  const user = this.userService.currentUser();
  this.isAdmin = user?.role === 'ADMIN';
  
  const id = Number(this.route.snapshot.paramMap.get('id'));

  this.modelService.getModelById(id).subscribe({
    next: (model: ModelModel) => {
      this.model = model;
      if (model.id) this.loadSizes(model.id);
      if (!this.isAdmin && this.cartService.lastSelectedDate()) {
        this.selectedDate = this.cartService.lastSelectedDate();
      }
      this.cdr.detectChanges();
    }
  });
}
  loadSizes(modelId: number): void {
    this.dressService.GetSizesByModelId(modelId).subscribe({
      next: (sizes: string[]) => {
        this.sizes = sizes;
        this.cdr.detectChanges();
      }
    });
  }

  onSizeChange(): void {
    this.selectedDate = null;
    this.isAvailable = false;
    this.availabilityChecked = false;
    this.invalidDate = false;
  }

  onDateSelect(): void {
    this.isAvailable = false;
    this.availabilityChecked = false;
    this.invalidDate = false;
  }

checkAvailability(): void {
  // 1. קודם כל בודקים שיש את כל הנתונים. אם אין - לא מפעילים את ה-loading
  if (!this.model?.id || !this.selectedSize || !this.selectedDate) {
    return; 
  }

  // 2. הפעלת ה-Loading ואיפוס מצבים
  this.loadingAvailability = true;
  this.availabilityChecked = false;
  this.invalidDate = false;

  // המרת התאריך לפורמט שהשרת אוהב
  const dateOnly = this.selectedDate.toLocaleDateString('en-CA'); 
  
  this.dressService
    .GetCountByModelIdAndSizeForDate(this.model.id, this.selectedSize, dateOnly)
    .subscribe({
      next: (count: number) => {
        this.availabilityChecked = true;
        this.isAvailable = count > 0;
        this.loadingAvailability = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('שגיאה בבדיקת זמינות:', err);
        if (err.message === 'INVALID_DATE') {
          this.invalidDate = true;
        } else {
          console.log("General server error");
        }

        this.availabilityChecked = true;
        this.isAvailable = false;
        this.loadingAvailability = false;
        this.cdr.detectChanges();
      }
    });
}

addToCart(): void {
  if (this.isAdmin) return;
  if (!this.isAvailable || !this.model || !this.selectedSize || !this.selectedDate) return;

  this.dressService.getDressByModelIdAndSize(this.model.id, this.selectedSize).subscribe({
    next: (dress: DressModel) => {
      this.dress = dress;

      const existingDraft = this.cartService.draftOrders().find(d =>
        new Date(d.eventDate).toDateString() === this.selectedDate!.toDateString()
      );

      if (existingDraft) {
        this.cartService.addItemToDraft(existingDraft.id, dress);
      } else {
        const newDraft = this.cartService.createDraftOrder(this.selectedDate!);
        this.cartService.addItemToDraft(newDraft.id, dress);
      }

      this.cartService.lastSelectedDate.set(this.selectedDate);

      this.selectedSize = null;
      this.isAvailable = false;
      this.availabilityChecked = false;
      this.invalidDate = false;
      this.cdr.detectChanges();

      console.log('השמלה נוספה לסל בהצלחה!');
    },
    error: (err) => {
      console.error('שגיאה בשליפת השמלה מהשרת:', err);
    }
  });
}

  goBack(): void {
    this.router.navigate(['/collection']);
  }

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/600x800';
  }
}