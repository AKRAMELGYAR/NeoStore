import { BadRequestException, Injectable } from '@nestjs/common';
import { user } from "../../DB/Model";
import { couponRepository } from "../../DB/Repository";
import { createCoupon } from './Dto/couponDto';

@Injectable()
export class CouponService {
    constructor(
        private readonly couponRepository: couponRepository
    ) { }

    async createCoupon(
        user: user,
        body: createCoupon
    ): Promise<object> {
        const { code, amount, fromDate, toDate } = body

        const couponExist = await this.couponRepository.findOne({ code })
        if (couponExist) {
            throw new BadRequestException('Coupon already exist')
        }
        const coupon = await this.couponRepository.create({
            userId: user._id,
            code,
            amount,
            fromDate,
            toDate
        })
        return { coupon }
    }
}
