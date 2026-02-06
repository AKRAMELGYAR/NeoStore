import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User, Cart } from './index'
import { OrderStatusTypes, PaymentMethodTypes } from "..\../common/types/types";



@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Order {

    @Prop({ type: Types.ObjectId, required: true, ref: User.name })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true, ref: Cart.name })
    cartId: Types.ObjectId

    @Prop({ type: Number, required: true })
    totalPrice: number;

    @Prop({ type: String, required: true })
    phone: string

    @Prop({ type: String, required: true })
    address: string

    @Prop({ type: String, enum: PaymentMethodTypes, required: true })
    paymentMethod: string

    @Prop({ type: String, enum: OrderStatusTypes, required: true })
    status: string

    @Prop({ type: Date, default: Date.now() + 3 * 24 * 60 * 60 * 1000 })
    arrivesAt: Date

    @Prop({
        type: {
            paidAt: Date,
            deliverdAt: Date,
            deliverdBy: { type: Types.ObjectId, ref: User.name },
            cancelledAt: Date,
            cancelledBy: { type: Types.ObjectId, ref: User.name },
            refundedAt: Date,
            refundedBy: { type: Types.ObjectId, ref: User.name }
        }
    })
    oerderChanges: object

    @Prop({ type: String })
    paymentIntent: string

    @Prop({
        type: [
            {
                productId: { type: Types.ObjectId, ref: 'Product', required: true },
                name: String,
                mainImage: String,
                subPrice: Number,
                quantity: Number,
            }
        ],
        required: true
    })
    items: {
        productId: Types.ObjectId;
        name: string;
        mainImage: string;
        subPrice: number;
        quantity: number;
    }[];

}

export const orderSchema = SchemaFactory.createForClass(Order);

export type orderDocument = HydratedDocument<Order>;
export const orderModel = MongooseModule.forFeature([{ name: Order.name, schema: orderSchema }]);
