import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { User, Category } from './index'

@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})
export class SubCategory {
    @Prop({
        type: String,
        required: true,
        minlength: 3,
        trim: true,
        lowercase: true
    })
    name: string;

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

    @Prop({ type: Types.ObjectId, required: true, ref: Category.name })
    categoryId: Types.ObjectId;

    @Prop({ type: Object })
    image: object;

    @Prop({ type: String })
    customId: string;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
export const SubCategoryModel = MongooseModule.forFeature([
    { name: SubCategory.name, schema: SubCategorySchema },
]);
export type SubCategoryDocument = HydratedDocument<SubCategory>;