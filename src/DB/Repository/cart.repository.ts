import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DataBaseRepository } from "./DataBase.Repository";
import { Cart, cartDocument } from "../Model";




export class CartRepository extends DataBaseRepository<cartDocument> {
    constructor(@InjectModel(Cart.name) private readonly cartModel: Model<cartDocument>) {
        super(cartModel);
    }
}