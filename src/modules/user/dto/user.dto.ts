import { Transform } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { CustomPassDecorator } from "..\..\../common/decorator/confirmPassword.Decorator";
import { UserGender } from "..\..\../common/types/types";


export class UserDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @MinLength(5, { message: 'Name must be at least 5 characters long', })
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail({}, { message: 'Email must be a valid email' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    pass: string;


    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Confirm Password must be at least 8 characters long' })
    @CustomPassDecorator({ message: 'Confirm Password does not match' })
    cpass: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(11)
    @MaxLength(11)
    @Matches(/^01[0125][0-9]{8}$/, {
        message: 'Phone number must be in the format 01X XXX XXXX',
    })
    phone: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(UserGender)
    gender: string;

    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    DOB: Date;

    @IsNotEmpty()
    @IsString()
    address: string;

}

export class loginDto {

    @IsNotEmpty()
    @IsString()
    @IsEmail({}, { message: 'must be a valid Email' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    pass: string;

}

export class ConfirmDto {
    @IsNotEmpty()
    @IsString()
    otp: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail({}, { message: 'Email must be a valid email' })
    email: string

}