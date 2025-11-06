import { InjectModel } from "@nestjs/mongoose";
import { Order, orderDocument } from "../Model";
import { DataBaseRepository } from "./DataBase.Repository";
import { Model } from "mongoose";



export class orderRepository extends DataBaseRepository<orderDocument> {
    constructor(@InjectModel(Order.name) private readonly orderModel: Model<orderDocument>) { super(orderModel) }
}