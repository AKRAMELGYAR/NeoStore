import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { categoryRepositoryService, UserRepositoryService } from "../../DB/Repository";
import { CategoryModel, UserModel } from "../../DB/Model";
import { CloudinaryService, TokenService } from "../../common/services";
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [CategoryModel, UserModel],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    categoryRepositoryService,
    TokenService,
    JwtService,
    UserRepositoryService,
    CloudinaryService
  ]
})
export class CategoryModule { }
