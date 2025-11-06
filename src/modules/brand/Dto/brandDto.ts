import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class createBrandDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @Transform(
        ({ value }) => (Array.isArray(value) ? value : [value]) as string[])
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    categoryId: Types.ObjectId[];

    @Transform(
        ({ value }) => (Array.isArray(value) ? value : [value]) as string[])
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    subCategoryId: Types.ObjectId[];
}

export class updateBrandDto {
    @IsString()
    @IsOptional()
    name: string;
}
