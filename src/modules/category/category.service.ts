import { BadRequestException, Injectable } from '@nestjs/common';
import { categoryRepositoryService } from 'src/DB/Repository';
import { categoryDto, updateCategory } from './Dto/category.dto';
import { user } from 'src/DB/Model';
import { CloudinaryService } from 'src/common/services';
import { Types } from 'mongoose';
import slugify from 'slugify';

interface _category {
    name?: string;
    userId?: Types.ObjectId;
    customId?: string;
    image?: object;
}


@Injectable()
export class CategoryService {
    constructor(
        private readonly categoryRepository: categoryRepositoryService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    async createCategory(category: categoryDto, user: user, file: Express.Multer.File): Promise<object> {

        const { name } = category
        const categoryExist = await this.categoryRepository.findOne({ name: name.toLowerCase() })

        if (categoryExist) {
            throw new BadRequestException('Category already exist')
        }

        let categoryData: _category = {
            name: name,
            userId: user.id,
        }

        const customId = Math.random().toString(36).substring(2, 7)
        if (file) {
            const { secure_url, public_id } = await this.cloudinaryService.UploadFile(file, {
                folder: `${process.env.CLOUDINARY_FOLDER}/Category/${customId}`
            })
            categoryData['image'] = { secure_url, public_id }
            categoryData['customId'] = customId
        }

        const newcategory = await this.categoryRepository.create(categoryData)

        return { newcategory }
    }

    async updateCategory(
        data: updateCategory,
        user: user,
        file: Express.Multer.File,
        categoryId: Types.ObjectId): Promise<object> {
        const { name } = data

        const category = await this.categoryRepository.findOne({ _id: categoryId, userId: user.id })
        if (!category) {
            throw new BadRequestException('Category not found or you are not authorized')
        }

        if (name) {
            if (await this.categoryRepository.findOne({ name: name.toString() })) {
                throw new BadRequestException('category already exist')
            }
            category.name = name
            category.slug = slugify(name, {
                trim: true,
                lower: true,
                replacement: '-',
            })
        }

        if (file) {
            await this.cloudinaryService.DeleteImage(category.image["public_id"])
            const { secure_url, public_id } = await this.cloudinaryService.UploadFile(file,
                { folder: `${process.env.CLOUDINARY_FOLDER}/Category/${category.customId}` })
            category.image = { secure_url, public_id }
        }

        await category.save()
        return { category }
    }

    async deleteCategory(id: Types.ObjectId): Promise<object> {
        const category = await this.categoryRepository.findOneAndDelete(id);
        if (category.image)
            await this.cloudinaryService.DeleteImage(category.image['public_id']);
        if (!category) throw new BadRequestException('Category not found');
        return { message: 'done' };
    }
}
