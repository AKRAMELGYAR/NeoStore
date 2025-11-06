import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { BrandRepository, categoryRepositoryService, productRepository, SubCategoryRepository } from 'src/DB/Repository';
import { BrandsModel, CategoryModel, ProductModel, SubCategoryModel } from 'src/DB/Model';
import { AiService } from 'src/common/services/ai.service';

@Module({
  imports: [ProductModel, BrandsModel, CategoryModel, SubCategoryModel],
  controllers: [ProductController],
  providers: [
    ProductService,
    productRepository,
    BrandRepository,
    categoryRepositoryService,
    SubCategoryRepository,
    AiService
  ]
})
export class ProductModule { }
