import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { Auth, userDecorator } from 'src/common/decorator';
import { UserRole } from 'src/common/types/types';
import { createCoupon } from './Dto/couponDto';
import { user } from 'src/DB/Model';

@Controller('coupon')
export class CouponController {
    constructor(private readonly couponService: CouponService) { }

    @Post('create')
    @Auth(UserRole.admin)
    @UsePipes(new ValidationPipe({}))
    async createCoupon(
        @Body() body: createCoupon,
        @userDecorator() user: user
    ) {
        return this.couponService.createCoupon(user, body)
    }
}
