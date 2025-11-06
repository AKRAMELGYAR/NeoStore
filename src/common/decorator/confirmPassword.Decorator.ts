import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class CustomPassConstraint implements ValidatorConstraintInterface {
    validate(cpass: string, args: ValidationArguments) {
        if (cpass !== args.object[args.constraints[0]]) {
            return false;
        }
        return true;
    }
}

export function CustomPassDecorator(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: ['pass'],
            validator: CustomPassConstraint,
        });
    };
}