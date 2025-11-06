import { Module } from '@nestjs/common';
import { SubCategoryController } from './sub-category.controller';
import { SubCategoryService } from './sub-category.service';
import { CategoryModel, SubCategoryModel } from 'src/DB/Model';
import { categoryRepositoryService, SubCategoryRepository } from 'src/DB/Repository';


@Module({
  imports: [SubCategoryModel, CategoryModel],
  controllers: [SubCategoryController],
  providers: [
    SubCategoryService,
    SubCategoryRepository,
    categoryRepositoryService,
  ]
})
export class SubCategoryModule { }
