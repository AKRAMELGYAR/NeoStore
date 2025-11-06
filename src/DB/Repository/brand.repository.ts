import { InjectModel } from "@nestjs/mongoose";
import { Brand, BrandsDocument } from "../Model/index";
import { DataBaseRepository } from "./DataBase.Repository";
import { Model } from "mongoose";



export class BrandRepository extends DataBaseRepository<BrandsDocument> {
    constructor(@InjectModel(Brand.name) private BrandModel: Model<BrandsDocument>) {
        super(BrandModel)
    }
}