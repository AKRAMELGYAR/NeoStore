import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepositoryService } from "../../DB/Repository";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "../../common/services/token";
import { HashingService } from "../../common/security/HashingService/Hash";
import { UserModel } from "../../DB/Model/index";


@Module({
    imports: [UserModel],
    controllers: [UserController],
    providers: [
        UserService,
        UserRepositoryService,
        TokenService,
        JwtService,
        HashingService

    ],
    exports: [],
})
export class UserModule { }