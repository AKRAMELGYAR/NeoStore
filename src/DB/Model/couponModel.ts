import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './index';
import { string } from 'zod';

@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})
export class Coupon {

    @Prop({ type: string, required: true, trim: true, minlength: 1, unique: true })
    code: string

    @Prop({ type: Number, required: true, min: 1, max: 100 })
    amount: number;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: Types.ObjectId

    // @Prop({ type: String, unique: true, required: true })
    // stripeId: string;

    @Prop({ type: Date, required: true })
    fromDate: Date;

    @Prop({ type: Date, required: true })
    toDate: Date;

    @Prop({ type: [Types.ObjectId], ref: User.name })
    usedBy: Types.ObjectId[];
}

export const CouponsSchema = SchemaFactory.createForClass(Coupon);
export const CouponsModel = MongooseModule.forFeature([
    { name: Coupon.name, schema: CouponsSchema },
]);
export type CouponDocument = HydratedDocument<Coupon>;