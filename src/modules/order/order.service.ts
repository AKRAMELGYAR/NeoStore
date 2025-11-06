import { BadRequestException, Injectable } from '@nestjs/common';
import { CartRepository, orderRepository, productRepository } from 'src/DB/Repository';
import { createOrderDto } from './Dto/orderDto';
import { user } from 'src/DB/Model';
import { OrderStatusTypes, PaymentMethodTypes } from 'src/common/types/types';
import { Types } from 'mongoose';
import { Payment } from './service/payment';

@Injectable()
export class OrderService {
    constructor(
        private readonly orderRepository: orderRepository,
        private readonly cartRepository: CartRepository,
        private readonly paymentService: Payment,
        private readonly productRepository: productRepository
    ) { }

    async createOrder(
        body: createOrderDto,
        user: user
    ): Promise<object> {
        const { phone, address, paymentMethod } = body
        const cart = await this.cartRepository.findOne({ userId: user._id })

        if (!cart || cart.products.length == 0) {
            throw new BadRequestException('Cart is Empty')
        }

        const order = await this.orderRepository.create({
            userId: user._id,
            cartId: cart._id,
            phone,
            address,
            paymentMethod,
            status: paymentMethod == PaymentMethodTypes.cash ? OrderStatusTypes.placed : OrderStatusTypes.pending,
            totalPrice: cart.subTotal
        })

        for (const item of cart.products) {
            const productId = item.productId;
            const quantityOrdered = item.quantity;

            await this.productRepository.findOneAndUpdate(
                { _id: productId },
                { $inc: { quantity: -quantityOrdered } },
            );
        }

        await this.cartRepository.findOneAndUpdate(
            { userId: user._id },
            {
                $set: {
                    products: [],
                    subTotal: 0
                }
            }
        );

        return {
            messade: "Order Created Successfully",
            order
        }
    }

    async createPaymentStripe(
        orderId: Types.ObjectId,
        user: user
    ) {
        const order = await this.orderRepository.findOne(
            { _id: orderId, userId: user._id, status: OrderStatusTypes.pending },
            [{
                path: 'cartId',
                select: 'products',
                populate: [{ path: 'products.productId' }]
            }]
        )

        if (!order) {
            throw new BadRequestException('order not found')
        }

        const session = await this.paymentService.checkOutSession({
            customer_email: user.email,
            metadata: { orderId: order._id.toString() },
            line_items: order.cartId['products'].map(product => ({
                price_data: {
                    currency: "egp",
                    product_data: {
                        name: product.productId.name,
                        images: [product.productId.mainImage.success_url]
                    },
                    unit_amount: product.productId.subPrice * 100
                },
                quantity: product.quantity
            })),
            discounts: []
        })

        return { url: session.url }

    }

    async webhookService(
        data: any
    ) {
        const orderId = data.data.object.metadata.orderId
        const order = await this.orderRepository.findOneAndUpdate(
            { _id: orderId },
            {
                status: OrderStatusTypes.paid,
                oerderChanges: {
                    paidAt: new Date()
                },
                paymentIntent: data.data.object.payment_intent
            }
        )

        return { order }
    }

    async cancelOrder(
        orderId: Types.ObjectId,
        user: user
    ) {
        const order = await this.orderRepository.findOneAndUpdate({
            _id: orderId,
            userId: user._id,
            status: { $in: [OrderStatusTypes.paid, OrderStatusTypes.pending, OrderStatusTypes.placed] }
        }, {
            status: OrderStatusTypes.cancelld,
            oerderChanges: {
                cancelledAy: new Date(),
                cancelledBy: user._id
            }

        })

        if (!order) {
            throw new BadRequestException('order not found')
        }

        if (order.paymentMethod == PaymentMethodTypes.card) {
            await this.paymentService.refund({ payment_intent: order.paymentIntent, reason: 'requested_by_customer' })
            await this.orderRepository.findOneAndUpdate({ _id: orderId, userId: user._id },
                {
                    status: OrderStatusTypes.refunded,
                    oerderChanges: {
                        refundedAy: new Date(),
                        refundedBy: user._id
                    }

                })
        }

        return { message: 'done' }
    }

    async getOrder(
        orderId: Types.ObjectId,
        user: user
    ): Promise<object> {
        const order = await this.orderRepository.findOne({ _id: orderId, userId: user._id })
        if (!order) {
            throw new BadRequestException('order not found or you are not authurized')
        }

        return (order)
    }


    async getAllOrder(
        user: user
    ): Promise<object> {
        const orders = await this.orderRepository.findAll({ userId: user._id })
        if (!orders) {
            throw new BadRequestException('orders not found or you are not authurized')
        }

        return (orders)
    }
}
