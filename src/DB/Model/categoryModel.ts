import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { User } from './index';

@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})
export class Category {
    @Prop({
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        minlength: 3,
        trim: true,
    })
    name: string;

    @Prop({
        type: String,
        default: function (): string {
            return slugify(this.name, {
                trim: true,
                lower: true,
                replacement: '-',
            });
        },
    })
    slug: string;

    @Prop({ type: Object })
    image: Object;

    @Prop({ type: Types.ObjectId, required: true, ref: User.name })
    userId: Types.ObjectId;

    @Prop({ type: String })
    customId: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
export const CategoryModel = MongooseModule.forFeature([
    { name: Category.name, schema: CategorySchema },
]);
export type CategoryDocument = HydratedDocument<Category>;