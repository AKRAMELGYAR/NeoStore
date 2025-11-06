import { Module } from '@nestjs/common';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { couponRepository } from 'src/DB/Repository';
import { CouponsModel } from 'src/DB/Model';

@Module({
  imports: [CouponsModel],
  controllers: [CouponController],
  providers: [
    CouponService,
    couponRepository
  ]
})
export class CouponModule { }
