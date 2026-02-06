import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { CartRepository, productRepository } from "../../DB/Repository";
import { CartDTO, RemoveCartDTO } from './Dto/cartDto';
import { user } from "../../DB/Model";
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
            // throw new BadRequestException('Product already in cart');
            productInCart.quantity += quantity;
            return await cart.save();
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
        const cart = await this.cartRepository.findOne({ userId: user._id }, [{ path: 'products.productId' }])
        if (!cart) {
            throw new BadGatewayException('Cart not found')
        }
        const productInCart = cart.products.find(item => item.productId._id.toString() === productId.toString())
        if (!productInCart) {
            throw new BadGatewayException('Product not found in cart')
        }

        const product = await this.productRepository.findOne({ _id: productId })
        if (!product) {
            throw new BadGatewayException('product not found or stock not available')
        }

        productInCart.quantity = quantity
        await cart.save()
        return cart
    }

    async removeFromCart(body: RemoveCartDTO, user: any) {

        const { productId } = body
        const product = await this.productRepository.findOne({ _id: productId })
        if (!product) {
            throw new Error("Product not found")
        }
        const cart = await this.cartRepository.findOne({ userId: user._id, 'products.productId': productId }, [{ path: 'products.productId' }])
        if (!cart) {
            throw new Error('cart or product not found')
        }

        cart.products = cart.products.filter(item => item.productId._id.toString() !== productId.toString())
        return await cart.save();

    }

    async getcart(
        user: user
    ): Promise<object> {
        const cart = await this.cartRepository.findOne({ userId: user._id }, [{ path: 'products.productId' }])
        if (!cart) {
            throw new BadRequestException('cart not found or you are not authurized')
        }

        return (cart)
    }
}
