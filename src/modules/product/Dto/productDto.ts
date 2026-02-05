import { Type } from 'class-transformer';
import {
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class createProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    price: number;

    @IsString()
    discount?: number;

    @IsString()
    quantity: number;

    @IsString()
    stock: number;

    @IsNotEmpty()
    @IsMongoId()
    brand: Types.ObjectId;

    @IsNotEmpty()
    @IsMongoId()
    category: Types.ObjectId;

    @IsNotEmpty()
    @IsMongoId()
    subCategory: Types.ObjectId;
}

export class updateProductDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsOptional()
    price: number;

    @IsOptional()
    @IsString()
    discount: number;
    @IsOptional()
    @IsString()
    quantity: number;
    @IsOptional()
    @IsString()
    stock: number;

    @IsOptional()
    @IsMongoId()
    brand: Types.ObjectId;

    @IsOptional()
    @IsMongoId()
    category: Types.ObjectId;

    @IsOptional()
    @IsMongoId()
    subCategory: Types.ObjectId;
}

export class ProductFilterDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    select?: string;

    @IsOptional()
    @IsString()
    sort?: string;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    page?: number;

    @IsOptional()
    @IsMongoId()
    category?: Types.ObjectId;

    @IsOptional()
    @IsMongoId()
    brand?: Types.ObjectId;
}