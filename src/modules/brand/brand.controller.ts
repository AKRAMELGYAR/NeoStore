import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { BrandService } from './brand.service';
import { Auth, userDecorator } from "../../common/decorator";
import { UserRole } from "../../common/types/types";
import { FileInterceptor } from '@nestjs/platform-express';
import { multerCloudinary } from "../../common/services";
import { ImageAllowedExt } from "../../common/constants/constants";
import { createBrandDto, updateBrandDto } from './Dto/brandDto';
import { user } from "../../DB/Model";
import { Types } from 'mongoose';

@Controller('brand')
export class BrandController {
    constructor(private readonly brandService: BrandService) { }

    @Get()
    @HttpCode(200)
    async getAllBrands(): Promise<object> {
        return await this.brandService.getAllBrands();
    }

    @Post('create')
    @HttpCode(201)
    @Auth(UserRole.admin)
    @UseInterceptors(
        FileInterceptor('logo', multerCloudinary({ allowedExt: ImageAllowedExt })),
    )
    @UsePipes(new ValidationPipe({}))
    async createBrand(
        @Body() body: createBrandDto,
        @userDecorator() user: user,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<object> {
        return await this.brandService.createbrand(body, user, file);
    }

    @Patch('update/:id')
    @HttpCode(201)
    @Auth(UserRole.admin)
    @UseInterceptors(
        FileInterceptor('logo', multerCloudinary({ allowedExt: ImageAllowedExt })),
    )
    @UsePipes(new ValidationPipe({}))
    async updateBrand(
        @Param('id') id: Types.ObjectId,
        @userDecorator() user: user,
        @Body() body: updateBrandDto,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<object> {
        return await this.brandService.UpdateBrand(id, user, body, file);
    }

    @Delete('delete/:id')
    @HttpCode(201)
    @Auth(UserRole.admin)
    async deletebrand(@Param('id') id: Types.ObjectId): Promise<object> {
        return await this.brandService.deletebrand(id);
    }


}
