
import { PipeTransform, Injectable, ArgumentMetadata, HttpException } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        console.log(value, metadata);
        if (value.pass !== value.cpass) {
            throw new HttpException("Password and Confirm Password do not match", 400);
        }
        // return value;
    }
}


// @Injectable()
// export class customPipe implements PipeTransform {
//     constructor(private userSchema: ZodSchema) { }

//     transform(value: any, metadata: ArgumentMetadata) {
//         try {
//             const parsedData = this.userSchema.parse(value)
//             return parsedData;

//         } catch (error) {
//             throw new HttpException(error, 400);
//         }
//         // return value;
//     }
// }
