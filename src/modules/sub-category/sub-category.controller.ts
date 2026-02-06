import { Body, Controller, Delete, HttpCode, Param, Patch, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { Auth, userDecorator } from "../../common/decorator";
import { FileInterceptor } from '@nestjs/platform-express';
import { multerCloudinary } from "../../common/services";
import { ImageAllowedExt } from "../../common/constants/constants";
import { createSubCategoryDto, updateSubCategoryDto } from './Dto/subCategoryDto';
import { user } from "../../DB/Model";
import { UserRole } from "../../common/types/types";
import { Types } from 'mongoose';

@Controller('sub-category')
export class SubCategoryController {
    constructor(private readonly subCategorySrevice: SubCategoryService) { }

    @Post('create')
    @HttpCode(201)
    @Auth(UserRole.admin)
    @UseInterceptors(
        FileInterceptor('image', multerCloudinary({ allowedExt: ImageAllowedExt })),
    )
    @UsePipes(new ValidationPipe({}))
    async createSubCategory(
        @Body() body: createSubCategoryDto,
        @userDecorator() user: user,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<object> {
        return await this.subCategorySrevice.createSubCategory(body, user, file);
    }

    @Patch('update/:id')
    @HttpCode(201)
    @Auth(UserRole.admin)
    @UseInterceptors(
        FileInterceptor('image', multerCloudinary({ allowedExt: ImageAllowedExt })),
    )
    @UsePipes(new ValidationPipe({}))
    async updateSubCategory(
        @Param('id') id: Types.ObjectId,
        @userDecorator() user: user,
        @Body() body: updateSubCategoryDto,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<object> {
        return await this.subCategorySrevice.UpdatesubCategory(id, user, body, file);
    }

    @Delete('delete/:id')
    @HttpCode(201)
    @Auth(UserRole.admin)
    async deleteSubCategory(@Param('id') id: Types.ObjectId): Promise<object> {
        return await this.subCategorySrevice.deletesubCategory(id);
    }
}
