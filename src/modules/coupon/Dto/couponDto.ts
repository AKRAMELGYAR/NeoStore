import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsPositive, IsString, Length, Max, Min, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";


@ValidatorConstraint({ async: true })
export class toDateValidation implements ValidatorConstraintInterface {
    validate(toDate: any, args: ValidationArguments) {
        if (toDate < args.object['fromDate']) {
            return false
        }
        return true
    }

    defaultMessage(args?: ValidationArguments): string {
        return `${args.property} must be after ${args.object['fromDate']}`
    }
}

@ValidatorConstraint({ async: true })
export class fromDateValidation implements ValidatorConstraintInterface {
    validate(fromDate: any, args: ValidationArguments) {
        return fromDate >= new Date()
    }

    defaultMessage(args?: ValidationArguments): string {
        return `fromDate must be in the future`
    }
}

export class createCoupon {

    @IsNotEmpty()
    @IsString()
    @Length(2, 10)
    code: string


    @Type(() => Number)
    @IsNotEmpty()
    @IsPositive()
    @Min(1)
    @Max(100)
    @IsNumber()
    amount: number


    @Type(() => Date)
    @IsNotEmpty()
    @IsDate()
    @Validate(fromDateValidation)
    fromDate: Date


    @Type(() => Date)
    @IsNotEmpty()
    @IsDate()
    @Validate(toDateValidation)
    toDate: Date
}