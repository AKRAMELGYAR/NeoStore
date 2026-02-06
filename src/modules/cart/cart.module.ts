import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { cartModel, ProductModel } from "..\../DB/Model";
import { CartRepository, productRepository } from "..\../DB/Repository";

@Module({
  imports: [cartModel, ProductModel],
  controllers: [CartController],
  providers: [
    CartService,
    CartRepository,
    productRepository
  ]
})
export class CartModule { }
