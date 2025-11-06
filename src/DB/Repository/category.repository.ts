import { InjectModel } from "@nestjs/mongoose";
import { DataBaseRepository } from "./DataBase.Repository";
import { Model } from "mongoose";
import { Category, CategoryDocument } from "../Model/index";


export class categoryRepositoryService extends DataBaseRepository<CategoryDocument> {
    constructor(@InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>) {
        super(categoryModel);
    }
}