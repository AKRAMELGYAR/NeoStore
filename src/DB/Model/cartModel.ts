
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User, Product } from './index'



@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Cart {

    @Prop({ type: Types.ObjectId, required: true, ref: User.name })
    userId: Types.ObjectId;

    @Prop({
        type: [{
            productId: { type: Types.ObjectId, ref: Product.name, required: true },
            quantity: { type: Number, required: true },
            finalPrice: { type: Number, required: true }
        }]
    })
    products: {
        productId: Types.ObjectId;
        quantity: number;
        finalPrice: number;
    }[];

    @Prop({ type: Number })
    subTotal: number;

}

export const cartSchema = SchemaFactory.createForClass(Cart);

cartSchema.pre('save', function (next) {
    this.subTotal = this.products.reduce((acc, item) => acc + (item.finalPrice * item.quantity), 0);
    next();
});
export type cartDocument = HydratedDocument<Cart>;
export const cartModel = MongooseModule.forFeature([{ name: Cart.name, schema: cartSchema }]);
