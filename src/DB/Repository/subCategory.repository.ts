import { InjectModel } from "@nestjs/mongoose";
import { SubCategory, SubCategoryDocument } from "../Model/index";
import { DataBaseRepository } from "./DataBase.Repository";
import { Model } from "mongoose";



export class SubCategoryRepository extends DataBaseRepository<SubCategoryDocument> {
    constructor(@InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategoryDocument>) {
        super(subCategoryModel)
    }
}