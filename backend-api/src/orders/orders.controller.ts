import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service.js';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @Body()
    body: {
      name: string;
      email: string;
      product: string;
      quantity: number;
    },
  ) {
    if (!body.name || !body.email) {
      throw new BadRequestException('الاسم والبريد مطلوبان');
    }
    return this.ordersService.create(body);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }
}
