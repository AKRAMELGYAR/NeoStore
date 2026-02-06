import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { categoryRepositoryService, SubCategoryRepository } from "..\../DB/Repository";
import { createSubCategoryDto, updateSubCategoryDto } from './Dto/subCategoryDto';
import { user } from "..\../DB/Model";
import { Types } from 'mongoose';
import { CloudinaryService } from "..\../common/services";
import slugify from 'slugify';


interface _subCategoryData {
    name?: string;
    userId?: Types.ObjectId;
    customId?: string;
    categoryId?: Types.ObjectId;
    image?: object
}



@Injectable()
export class SubCategoryService {
    constructor(
        private readonly subCategoryRepository: SubCategoryRepository,
        private readonly categoryRepository: categoryRepositoryService,
        private readonly cloudinaryService: CloudinaryService
    ) { }


    async createSubCategory(
        body: createSubCategoryDto,
        user: user,
        file: Express.Multer.File,
    ): Promise<object> {
        const { name, categoryId } = body;
        if (!name || !categoryId) throw new BadRequestException('mising data');
        const findCategory = await this.categoryRepository.findOne({ _id: categoryId });
        if (!findCategory) throw new BadRequestException('Category not found');
        const findSubCategory = await this.subCategoryRepository.findOne({ name: name.toLowerCase() });
        if (findSubCategory)
            throw new ConflictException('SubCategory already exists');
        let subCategoryData: _subCategoryData = {
            name,
            categoryId: new Types.ObjectId(categoryId),
            userId: user._id,
        };
        if (file) {
            const customId = Math.random().toString(36).substring(2, 7);
            const result = await this.cloudinaryService.UploadFile(file, {
                folder: `${process.env.CLOUDINARY_FOLDER}/Category/${findCategory.customId}/subCategory/${customId}`,
            });
            subCategoryData = {
                ...subCategoryData,
                image: {
                    secure_url: result['secure_url'] as string,
                    public_id: result['public_id'] as string,
                },
                customId,
            };
        }
        const newsubCategory = await this.subCategoryRepository.create(subCategoryData);

        return {
            message: 'done',
            subCategory: { newsubCategory },
        };
    }

    async UpdatesubCategory(
        id: Types.ObjectId,
        user: user,
        data: updateSubCategoryDto,
        file?: Express.Multer.File,
    ): Promise<object> {

        const { name } = data


        const subCategory = await this.subCategoryRepository.findOne({ _id: id, userId: user._id });

        if (!subCategory) throw new BadRequestException('SubCategory not found or you are not authorized');

        if (name) {
            if (await this.subCategoryRepository.findOne({ name: name.toLowerCase() }))
                throw new BadRequestException('subCategory already exists');

            subCategory.name = name
            subCategory.slug = slugify(name, {
                trim: true,
                lower: true,
                replacement: '-',
            })
        }
        if (file) {
            await this.cloudinaryService.DeleteImage(subCategory.image['public_id']);
            const { secure_url, public_id } = await this.cloudinaryService.UploadFile(file, {
                folder: `${process.env.CLOUDINARY_FOLDER}/Category/${subCategory.categoryId}/subCategory/${subCategory.customId}`,
            });
            subCategory.image = { secure_url, public_id }
        }
        await subCategory.save();
        return {
            message: 'done',
            data: { subCategory }
        };
    }

    async deletesubCategory(id: Types.ObjectId): Promise<object> {
        const subcategory = await this.subCategoryRepository.findOneAndDelete({ _id: id });
        if (subcategory?.image)
            await this.cloudinaryService.DeleteImage(subcategory?.image['public_id']);
        if (!subcategory) throw new BadRequestException('Category not found');
        return { message: 'done' };
    }
}
