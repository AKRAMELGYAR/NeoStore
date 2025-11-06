import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';

interface MulterOptions {
    allowedExt: string[];
}

export const multerCloudinary = ({ allowedExt }: MulterOptions) => {
    const storage = diskStorage({});

    const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
        if (!allowedExt.includes(file.mimetype)) {
            return cb(new BadRequestException('Invalid file type'), false);
        }
        cb(null, true);
    };

    return { storage, fileFilter };
};