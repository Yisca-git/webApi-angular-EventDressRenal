import { NewOrderItemModel } from './new-order-item.model';

export class NewOrder {
    orderDate!: Date;      
    eventDate!: Date;
    finalPrice!: number;
    userId!: number;
    note?: string;        
    orderItems!: NewOrderItemModel[]; 
}