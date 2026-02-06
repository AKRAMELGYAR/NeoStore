import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth, userDecorator } from "..\../common/decorator";
import { UserRole } from "..\../common/types/types";
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerCloudinary } from "..\../common/services";
import { ImageAllowedExt } from "..\../common/constants/constants";
import { createProductDto, ProductFilterDto, updateProductDto } from './Dto/productDto';
import { user } from "..\../DB/Model";
import { Types } from 'mongoose';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post('create')
    @HttpCode(201)
    @Auth(UserRole.admin)
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'mainImage', maxCount: 1 },
                { name: 'subImages', maxCount: 5 },
            ],
            multerCloudinary({ allowedExt: ImageAllowedExt }),
        ),
    )
    @UsePipes(new ValidationPipe({}))
    async createProduct(
        @Body() body: createProductDto,
        @UploadedFiles() files: { subImages: Express.Multer.File[]; mainImage: Express.Multer.File },
        @userDecorator() user: user,
    ): Promise<object> {
        return await this.productService.createProduct(body, files, user);
    }

    @Patch('update/:productId')
    @HttpCode(201)
    @Auth(UserRole.admin)
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'mainImage', maxCount: 1 },
                { name: 'subImages', maxCount: 5 },
            ],
            multerCloudinary({ allowedExt: ImageAllowedExt }),
        ),
    )
    @UsePipes(new ValidationPipe({}))
    async updateProduct(
        @Body() body: updateProductDto,
        @UploadedFiles() files: { subImages: Express.Multer.File[]; mainImage: Express.Multer.File },
        @userDecorator() user: user,
        @Param('productId') productId: Types.ObjectId
    ): Promise<object> {
        return await this.productService.updateProduct(body, files, user, productId);
    }

    @Get()
    @HttpCode(200)
    async getAllProducts(
        @Query() query: ProductFilterDto
    ) {
        return this.productService.getAllProducts(query)
    }

    @Get('/:productId')
    async getproduct(
        @Param('productId') productId: Types.ObjectId,
    ) {
        return this.productService.getproduct(productId)
    }

    @Post('ai')
    async askAi(@Body('prompt') prompt: string) {
        return this.productService.askAi(prompt)
    }
}
