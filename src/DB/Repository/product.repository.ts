import { InjectModel } from "@nestjs/mongoose";
import { Product, ProductDocument } from "../Model";
import { DataBaseRepository } from "./DataBase.Repository";
import { Model } from "mongoose";


export class productRepository extends DataBaseRepository<ProductDocument> {
    constructor(@InjectModel(Product.name) private readonly productModel: Model<ProductDocument>) {
        super(productModel)
    }
}