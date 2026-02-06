import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { BrandRepository, categoryRepositoryService, SubCategoryRepository, UserRepositoryService } from "..\../DB/Repository";
import { CloudinaryService, TokenService } from "..\../common/services";
import { JwtService } from '@nestjs/jwt';
import { BrandsModel, CategoryModel, SubCategoryModel, UserModel } from "..\../DB/Model";

@Module({
  imports: [BrandsModel, SubCategoryModel, CategoryModel, UserModel],
  controllers: [BrandController],
  providers: [
    BrandService,
    SubCategoryRepository,
    categoryRepositoryService,
    CloudinaryService,
    TokenService,
    JwtService,
    UserRepositoryService,
    BrandRepository
  ]
})
export class BrandModule { }
