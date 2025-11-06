import { Body, Controller, Delete, Param, Patch, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { categoryDto } from './Dto/category.dto';
import { UserRole } from 'src/common/types/types';
import { user } from 'src/DB/Model';
import { userDecorator, Auth } from 'src/common/decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerCloudinary } from 'src/common/services/multer';
import { ImageAllowedExt } from 'src/common/constants/constants';
import { Types } from 'mongoose';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Auth(UserRole.admin)
    @Post('create')
    @UseInterceptors(FileInterceptor('image', multerCloudinary({ allowedExt: ImageAllowedExt })))
    @UsePipes(new ValidationPipe({}))
    async createCategory(
        @Body() category: categoryDto,
        @userDecorator() user: user,
        @UploadedFile() image: Express.Multer.File
    ) {
        return this.categoryService.createCategory(category, user, image)
    }

    @Auth(UserRole.admin)
    @Patch('update/:id')
    @UseInterceptors(FileInterceptor('image', multerCloudinary({ allowedExt: ImageAllowedExt })))
    @UsePipes(new ValidationPipe({}))
    async updateCategory(
        @Body() category: categoryDto,
        @userDecorator() user: user,
        @UploadedFile() image: Express.Multer.File,
        @Param('id') id: Types.ObjectId
    ) {
        return await this.categoryService.updateCategory(category, user, image, id)
    }

    @Auth(UserRole.admin)
    @Delete('delete/:id')
    async deleteCategory(@Param('id') id: Types.ObjectId) {
        return this.categoryService.deleteCategory(id)
    }


}
