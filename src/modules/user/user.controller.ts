import { Body, Controller, Get, HttpCode, Post, Req, SetMetadata, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { ConfirmDto, loginDto, UserDto } from "./dto/user.dto";
import { UserRole } from "src/common/types/types";
import { userDecorator } from "src/common/decorator/user.decorator";
import { user } from "src/DB/Model";
import { Auth } from "src/common/decorator/auth.decorator";


@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }


    @Post('signup')
    @HttpCode(201)
    @UsePipes(new ValidationPipe())
    async signUp(@Body() body: UserDto): Promise<object> {
        return this.userService.signUp(body)
    }

    @Post('confirmEmail')
    @HttpCode(201)
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async ConfirmEmail(@Body() body: ConfirmDto) {
        return await this.userService.ConfirmEmailService(body);
    }

    @Post('signin')
    @HttpCode(200)
    @UsePipes(new ValidationPipe({}))
    async signIn(@Body() body: loginDto): Promise<{ token: string }> {
        return this.userService.signIn(body);
    }

    @Auth(UserRole.admin)
    @Get('profile')
    @HttpCode(200)
    async getProfile(@userDecorator() user: user): Promise<any> {
        return user
    }

}