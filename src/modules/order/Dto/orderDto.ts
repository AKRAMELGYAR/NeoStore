import { IsEnum, IsNotEmpty, IsString } from "class-validator"
import { PaymentMethodTypes } from "src/common/types/types"


export class createOrderDto {

    @IsNotEmpty()
    @IsString()
    phone: string


    @IsNotEmpty()
    @IsString()
    address: string

    @IsEnum(PaymentMethodTypes)
    @IsNotEmpty()
    paymentMethod: string
}