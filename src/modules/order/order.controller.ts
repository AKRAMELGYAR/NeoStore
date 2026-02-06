import { Body, Controller, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth, userDecorator } from "..\../common/decorator";
import { UserRole } from "..\../common/types/types";
import { createOrderDto } from './Dto/orderDto';
import { user } from "..\../DB/Model";
import { Types } from 'mongoose';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }


    @HttpCode(201)
    @Post('create')
    @Auth(UserRole.user, UserRole.admin)
    @UsePipes(new ValidationPipe({}))
    async createOrder(
        @Body() body: createOrderDto,
        @userDecorator() user: user
    ): Promise<object> {
        return this.orderService.createOrder(body, user)
    }


    @Post('create-payment')
    @Auth(UserRole.user, UserRole.admin)
    @UsePipes(new ValidationPipe({}))
    async createPayment(
        @Body('orderId') orderId: Types.ObjectId,
        @userDecorator() user: user
    ): Promise<object> {
        return this.orderService.createPaymentStripe(orderId, user)
    }

    @Post('/webhook')
    async webhook(
        @Body() data: any
    ) {
        return this.orderService.webhookService(data)
    }

    @Get('/:orderId')
    @Auth(UserRole.admin, UserRole.user)
    async getOrder(
        @Param('orderId') orderId: Types.ObjectId,
        @userDecorator() user: user
    ) {
        return this.orderService.getOrder(orderId, user)
    }


    @Get()
    @Auth(UserRole.admin, UserRole.user)
    async getAllOrders(
        @userDecorator() user: user
    ) {
        return this.orderService.getAllOrder(user)
    }


    @Put('cancel')
    @Auth(UserRole.user, UserRole.admin)
    @UsePipes(new ValidationPipe({}))
    async cancelOrder(
        @Body('orderId') orderId: Types.ObjectId,
        @userDecorator() user: user
    ): Promise<object> {
        return this.orderService.cancelOrder(orderId, user)
    }
}
