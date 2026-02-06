import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CloudinaryService } from "..\../common/services";
import { BrandRepository, categoryRepositoryService, SubCategoryRepository } from "..\../DB/Repository";
import { createBrandDto, updateBrandDto } from './Dto/brandDto';
import { user } from "..\../DB/Model";
import slugify from 'slugify';


interface _brandData {
    name?: string;
    userId?: Types.ObjectId;
    logo?: object;
    customId?: string;
    categoryId?: Types.ObjectId[];
    subCategoryId?: Types.ObjectId[];
}


@Injectable()
export class BrandService {
    constructor(
        private readonly subCategoryRepository: SubCategoryRepository,
        private readonly categoryRepository: categoryRepositoryService,
        private readonly cloudinaryService: CloudinaryService,
        private readonly brandRepository: BrandRepository
    ) { }


    async getAllBrands() {
        return await this.brandRepository.find({
            populate: [{ path: 'categoryId' }, { path: 'subCategoryId' }],
        })
    }

    async createbrand(
        body: createBrandDto,
        user: user,
        file: Express.Multer.File,
    ): Promise<object> {

        const { name, categoryId, subCategoryId } = body;

        if (!name || !categoryId || !subCategoryId) {
            throw new BadRequestException('mising data');
        }

        const findCategory = await this.categoryRepository.findOne({ _id: categoryId });
        if (!findCategory) {
            throw new BadRequestException('Category not found');
        }

        const findSubCategory = await this.subCategoryRepository.findOne({ _id: subCategoryId });
        if (!findSubCategory) {
            throw new BadRequestException('SubCategory not found');
        }

        const findBrand = await this.brandRepository.findOne({ name: name.toLowerCase() })
        if (findBrand) {
            throw new ConflictException('Brand already exist')
        }

        let brandData: _brandData = {
            name,
            userId: user._id,
            categoryId,
            subCategoryId
        }

        if (file) {
            const customId = Math.random().toString(36).substring(2, 7);
            const { secure_url, public_id } = await this.cloudinaryService.UploadFile(file, {
                folder: `${process.env.CLOUDINARY_FOLDER}/Category/${findCategory.customId}/subCategory/${findSubCategory.customId}/Brand/${customId}`,
            });
            brandData['logo'] = { secure_url, public_id }
            brandData['customId'] = customId
        }
        const newsubCategory = await this.brandRepository.create(brandData);

        return {
            message: 'done',
            data: { newsubCategory },
        };
    }

    async UpdateBrand(
        id: Types.ObjectId,
        user: user,
        data: updateBrandDto,
        file?: Express.Multer.File,
    ): Promise<object> {

        const { name } = data

        const brand = await this.brandRepository.findOne({ _id: id, userId: user._id })
        if (!brand) {
            throw new BadRequestException('Brand not found or you are not authorized')
        }

        if (name) {
            if (await this.brandRepository.findOne({ name: name.toLowerCase() }))
                throw new BadRequestException('brand already exists');

            brand.name = name
            brand.slug = slugify(name, {
                trim: true,
                lower: true,
                replacement: '-',
            })
        }
        if (file) {
            await this.cloudinaryService.DeleteImage(brand.logo['public_id']);
            const { secure_url, public_id } = await this.cloudinaryService.UploadFile(file, {
                folder: `${process.env.CLOUDINARY_FOLDER}/Category/${brand.categoryId}/subCategory/${brand.subCategoryId}/Brand/${brand.customId}`,
            });
            brand.logo = { secure_url, public_id }
        }
        await brand.save();
        return {
            message: 'done',
            data: { brand }
        };
    }

    async deletebrand(id: Types.ObjectId): Promise<object> {
        const brand = await this.brandRepository.findOneAndDelete({ _id: id });
        if (brand?.logo)
            await this.cloudinaryService.DeleteImage(brand?.logo['public_id']);
        if (!brand) throw new BadRequestException('brand not found');
        return { message: 'done' };
    }
}
