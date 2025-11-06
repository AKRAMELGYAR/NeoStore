import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { Category, SubCategory, User } from './index';

@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})
export class Brand {
    @Prop({
        type: String,
        required: true,
        minlength: 3,
        trim: true,
        lowercase: true
    })
    name: string;

    @Prop({ type: Object })
    logo: Object;

    @Prop({
        type: String,
        default: function () {
            return slugify(this.name, {
                lower: true,
                trim: true,
                replacement: '-',
            });
        },
    })
    slug: string;

    @Prop({ type: Types.ObjectId, required: true, ref: User.name })
    userId: Types.ObjectId;

    @Prop({ type: [Types.ObjectId], required: true, ref: Category.name })
    categoryId: Types.ObjectId[];

    @Prop({ type: [Types.ObjectId], required: true, ref: SubCategory.name })
    subCategoryId: Types.ObjectId[];

    @Prop({ type: String, required: true })
    customId: string;
}

export const BrandsSchema = SchemaFactory.createForClass(Brand);
export const BrandsModel = MongooseModule.forFeature([
    { name: Brand.name, schema: BrandsSchema },
]);
export type BrandsDocument = HydratedDocument<Brand>;