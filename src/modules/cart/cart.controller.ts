import { Body, Controller, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { Auth, userDecorator } from 'src/common/decorator';
import { UserRole } from 'src/common/types/types';
import { CartDTO } from './Dto/cartDto';
import { user } from 'src/DB/Model';
import { Types } from 'mongoose';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Post('add')
    @Auth(UserRole.user)
    @UsePipes(new ValidationPipe({}))
    addToCart(
        @Body() body: CartDTO,
        @userDecorator() user: user
    ): Promise<object> {
        return this.cartService.createCart(body, user);
    }

    @Patch('remove')
    @Auth(UserRole.user)
    @UsePipes(new ValidationPipe({}))
    removeFromCart(
        @Body() body: CartDTO,
        @userDecorator() user: user
    ): Promise<object> {
        return this.cartService.removeFromCart(body, user);
    }

    @Patch('update')
    @Auth(UserRole.user)
    @UsePipes(new ValidationPipe({}))
    updateCart(
        @Body() body: CartDTO,
        @userDecorator() user: user
    ): Promise<object> {

        return this.cartService.updateCart(body, user);
    }


    @Get('/:cartId')
    @Auth(UserRole.admin, UserRole.user)
    async getOrder(
        @Param('cartId') cartId: Types.ObjectId,
        @userDecorator() user: user
    ) {
        return this.cartService.getcart(cartId, user)
    }
}
