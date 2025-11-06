import { InjectModel } from "@nestjs/mongoose";
import { DataBaseRepository } from "./DataBase.Repository";
import { Coupon, CouponDocument } from "../Model";
import { Model } from "mongoose";


export class couponRepository extends DataBaseRepository<CouponDocument> {
    constructor(@InjectModel(Coupon.name) private readonly couponModel: Model<CouponDocument>) {
        super(couponModel)
    }
}