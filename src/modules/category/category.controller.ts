import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { categoryDto } from './Dto/category.dto';
import { UserRole } from "../../common/types/types";
import { user } from "../../DB/Model";
import { userDecorator, Auth } from "../../common/decorator";
import { FileInterceptor } from '@nestjs/platform-express';
import { multerCloudinary } from "../../common/services/multer";
import { ImageAllowedExt } from "../../common/constants/constants";
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

    @Get()
    async getAllCategories() {
        return this.categoryService.getAllCategories();
    }


}
