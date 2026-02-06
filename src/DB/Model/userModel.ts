import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { EncryptionServices } from "../../common/security/EncryptionService/encryption";
import { HashingService } from "../../common/security/HashingService/Hash";
import { UserRole, UserGender } from '../../common/types/types'


@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
export class User {
    @Prop({ required: true, maxlength: 50, minlength: 3 })
    name: string;

    @Prop({ required: true, unique: true, maxlength: 50, minlength: 5 })
    email: string;

    @Prop({ type: Date, required: true })
    DOB: Date;

    @Prop({ type: Boolean, default: false })
    confirmed: boolean;

    @Prop({ type: Boolean })
    isDeleted: Boolean;

    @Prop({ type: String, enum: UserRole, default: UserRole.user })
    role: string;

    @Prop({ type: String, required: true, enum: UserGender })
    gender: string;

    @Prop({ type: String, required: true, minlength: 11, maxlength: 11 })
    phone: string;

    @Prop({ type: String, required: true })
    address: string;

    @Prop({ required: true, maxlength: 50, minlength: 5 })
    pass: string;

    @Prop({ type: [Object] })
    otp: [
        {
            otp: string;
            expire: Date;
            type: string;
        },
    ];

}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
    if (this.isDirectModified('phone')) {
        this.phone = await EncryptionServices.getInstance().Encryption(this.phone)
    }
    if (this.isDirectModified('pass')) {
        this.pass = await HashingService.getInstance().Hash(this.pass)
    }
    next()
})

export type user = HydratedDocument<User>;
export const UserModel = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]);