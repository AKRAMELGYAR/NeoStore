import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepositoryService } from "src/DB/Repository";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "src/common/services/token";
import { HashingService } from "src/common/security/HashingService/Hash";
import { UserModel } from "src/DB/Model/index";


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