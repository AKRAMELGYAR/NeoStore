import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";


export class CartDTO {

    @IsNotEmpty()
    @IsString()
    productId: string;

    @Type(() => Number)
    @IsPositive()
    @IsNumber()
    @IsNotEmpty()
    quantity: number;
}