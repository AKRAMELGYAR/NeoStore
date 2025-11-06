import { Injectable } from '@nestjs/common';
import { UploadApiOptions } from 'cloudinary';
import { cloudinaryConfig } from '../utils/cloudinary.config';

@Injectable()
export class CloudinaryService {
    constructor() { }
    private _cloudinary = cloudinaryConfig()

    async UploadFile(
        file: Express.Multer.File,
        options: UploadApiOptions,
    ) {
        return await this._cloudinary.uploader.upload(file.path, options)
    }

    async UploadFiles(
        files: Express.Multer.File[]
        , options: UploadApiOptions
    ): Promise<{ secure_url: string; public_id: string }[]> {
        const result: { secure_url: string; public_id: string }[] = [];
        for (const file of files) {
            const { secure_url, public_id } = await this._cloudinary.uploader.upload(file.path, options);
            result.push({ secure_url, public_id });
        }
        console.log(result)
        return result;
    }

    async DeleteImage(filePath: string): Promise<void> {
        await this._cloudinary.uploader.destroy(filePath);
    }

    async DeleteImages(filePath: string): Promise<void> {
        await this._cloudinary.api.delete_resources_by_prefix(filePath);
        await this._cloudinary.api.delete_folder(filePath);
    }
}