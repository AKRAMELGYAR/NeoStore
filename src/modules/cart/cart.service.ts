import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { CartRepository, productRepository } from 'src/DB/Repository';
import { CartDTO } from './Dto/cartDto';
import { user } from 'src/DB/Model';
import { Types } from 'mongoose';

@Injectable()
export class CartService {
    constructor(
        private readonly cartRepository: CartRepository,
        private readonly productRepository: productRepository
    ) { }


    async createCart(body: CartDTO, user: user) {

        const { productId, quantity } = body;
        const productExists = await this.productRepository.findOne({ _id: productId });
        if (!productExists) {
            throw new Error('Product not found');
        }

        const cart = await this.cartRepository.findOne({ userId: user._id })
        if (!cart) {
            return await this.cartRepository.create({
                userId: user._id,
                products: [{
                    productId: productExists._id,
                    quantity,
                    finalPrice: productExists.subPrice
                }]
            });
        }

        let productInCart = cart.products.find(item => item.productId.toString() === productId.toString());
        if (productInCart) {
            throw new Error('Product already in cart');
        }

        cart.products.push({
            productId: Types.ObjectId.createFromHexString(productId),
            quantity,
            finalPrice: productExists.price
        });

        return await cart.save();
    }

    async updateCart(body: CartDTO, user: user) {
        const { productId, quantity } = body

        const cart = await this.cartRepository.findOne({ userId: user._id })
        if (!cart) {
            throw new BadGatewayException('Cart not found')
        }

        const productInCart = cart.products.find(item => item.productId.toString() === productId.toString())
        if (!productInCart) {
            throw new BadGatewayException('Product not found in cart')
        }

        const product = await this.productRepository.findOne({ _id: productId })
        if (!product) {
            throw new BadGatewayException('product not found or stock not available')
        }

        productInCart.quantity = quantity
        return await cart.save()
    }

    async removeFromCart(body: CartDTO, user: any) {

        const { productId } = body
        const product = await this.productRepository.findOne({ _id: productId })
        if (!product) {
            throw new Error("Product not found")
        }
        const cart = await this.cartRepository.findOne({ userId: user._id, 'products.productId': productId })
        if (!cart) {
            throw new Error('cart or product not found')
        }

        cart.products = cart.products.filter(item => item.productId.toString() !== productId.toString())
        return await cart.save();

    }

    async getcart(
        cartId: Types.ObjectId,
        user: user
    ): Promise<object> {
        const cart = await this.cartRepository.findOne({ _id: cartId, userId: user._id })
        if (!cart) {
            throw new BadRequestException('cart not found or you are not authurized')
        }

        return (cart)
    }
}
