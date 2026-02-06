import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { cartModel, orderModel, ProductModel } from "..\../DB/Model";
import { CartRepository, orderRepository, productRepository } from "..\../DB/Repository";
import { Payment } from './service/payment';

@Module({
  imports: [orderModel, cartModel, ProductModel],
  controllers: [OrderController],
  providers: [
    OrderService,
    orderRepository,
    CartRepository,
    Payment,
    productRepository
  ]
})
export class OrderModule { }
