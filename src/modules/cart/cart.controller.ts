import { Body, Controller, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { Auth, userDecorator } from "../../common/decorator";
import { UserRole } from "../../common/types/types";
import { CartDTO, RemoveCartDTO } from './Dto/cartDto';
import { user } from "../../DB/Model";

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Post('add')
    @Auth(UserRole.user, UserRole.admin)
    @UsePipes(new ValidationPipe({}))
    addToCart(
        @Body() body: CartDTO,
        @userDecorator() user: user
    ): Promise<object> {
        return this.cartService.createCart(body, user);
    }

    @Patch('remove')
    @Auth(UserRole.user, UserRole.admin)
    @UsePipes(new ValidationPipe({}))
    removeFromCart(
        @Body() body: RemoveCartDTO,
        @userDecorator() user: user
    ): Promise<object> {
        return this.cartService.removeFromCart(body, user);
    }

    @Patch('update')
    @Auth(UserRole.user, UserRole.admin)
    @UsePipes(new ValidationPipe({}))
    updateCart(
        @Body() body: CartDTO,
        @userDecorator() user: user
    ): Promise<object> {

        return this.cartService.updateCart(body, user);
    }


    @Get('/')
    @Auth(UserRole.admin, UserRole.user)
    async getOrder(
        @userDecorator() user: user
    ) {
        return this.cartService.getcart(user)
    }
}
