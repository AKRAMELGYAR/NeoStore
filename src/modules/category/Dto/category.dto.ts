import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class categoryDto {

    @IsString()
    @IsOptional()
    name: string

}

export class updateCategory {

    @IsString()
    @IsOptional()
    name: string

}