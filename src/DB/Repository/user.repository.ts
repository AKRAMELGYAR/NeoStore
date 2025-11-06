import { InjectModel } from "@nestjs/mongoose";
import { User } from "../Model/index";
import { DataBaseRepository } from "./DataBase.Repository";
import { Model } from "mongoose";


export class UserRepositoryService extends DataBaseRepository<User> {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
        super(userModel);
    }
}