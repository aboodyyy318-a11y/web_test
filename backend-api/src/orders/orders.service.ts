import { Injectable } from '@nestjs/common';

type Order = {
  id: number;
  name: string;
  email: string;
  product: string;
  quantity: number;
};

@Injectable()
export class OrdersService {
  private orders: Order[] = [];

  create(orderData: {
    name: string;
    email: string;
    product: string;
    quantity: number;
  }) {
    const newOrder: Order = { id: Date.now(), ...orderData };
    this.orders.push(newOrder);
    return newOrder;
  }

  findAll() {
    return this.orders;
  }
}
