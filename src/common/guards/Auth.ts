
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TokenService } from '../services/token';
import { UserRepositoryService } from 'src/DB/Repository/user.repository';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private TokenService: TokenService,
        private UserRepositoryService: UserRepositoryService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.TokenService.verifyToken(
                token,
                {
                    secret: process.env.JWT_SECRET
                }
            );

            const user = await this.UserRepositoryService.findOne({ email: payload.email });
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            request['user'] = user;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

}
