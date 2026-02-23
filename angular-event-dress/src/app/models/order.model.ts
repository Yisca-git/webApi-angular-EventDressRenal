import { OrderItemModel } from './order-item.model'; 

export class Order {
    id!: number;
    orderDate!: Date;     
    eventDate!: Date;
    finalPrice!: number;
    userId!: number;
    note?: string;         
    statusId!: number;
    statusName!: string;
    userFirstName!: string;
    userLastName!: string;
    orderItems!: OrderItemModel[]; 
}