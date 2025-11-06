import { Module, Global } from '@nestjs/common';
import { CloudinaryService, TokenService } from './common/services';
import { JwtService } from '@nestjs/jwt';
import { UserRepositoryService } from './DB/Repository';
import { UserModel } from './DB/Model';


@Global()
@Module({
    imports: [UserModel],
    controllers: [],
    providers: [
        CloudinaryService,
        TokenService,
        JwtService,
        UserRepositoryService
    ],
    exports: [
        UserModel,
        CloudinaryService,
        TokenService,
        JwtService,
        UserRepositoryService
    ],
})
export class GlobalModule { }
