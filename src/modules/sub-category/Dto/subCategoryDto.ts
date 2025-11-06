import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class createSubCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsMongoId()
    @IsNotEmpty()
    categoryId: Types.ObjectId;
}

export class updateSubCategoryDto {
    @IsString()
    @IsOptional()
    name: string
}
