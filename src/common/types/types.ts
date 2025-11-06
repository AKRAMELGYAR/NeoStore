import { FilterQuery, PopulateOptions, Types } from "mongoose";

export enum UserRole {
    user = 'user',
    admin = 'admin'
}

export enum UserGender {
    male = 'male',
    female = 'female'
}

export interface _productData {
    name?: string;
    description?: string;
    mainImage?: object;
    subImages?: object[];
    price?: number;
    discount?: number;
    subPrice?: number;
    quantity?: number;
    stock?: number;
    customId?: string;
    brand?: Types.ObjectId;
    category?: Types.ObjectId;
    subCategory?: Types.ObjectId;
    userId?: Types.ObjectId;
}

export interface FindOptions<TDocument> {
    filter?: FilterQuery<TDocument>
    populate?: PopulateOptions[]
    select?: string
    sort?: string
    page?: number
}

export enum OrderStatusTypes {
    paid = "paid",
    pending = "pending",
    placed = "placed",
    onWay = "onWay",
    deliverd = "deliverd",
    cancelld = "cancelld",
    rejected = "rejected",
    refunded = "refunded"

}

export enum PaymentMethodTypes {
    cash = "cash",
    card = "card"
}