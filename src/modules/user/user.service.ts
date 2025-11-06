import { BadRequestException, ConflictException, Injectable, NotFoundException, Req } from "@nestjs/common";
import { ConfirmDto, loginDto, UserDto } from "./dto/user.dto";
import { TokenService } from "src/common/services/token";
import { HashingService } from "src/common/security/HashingService/Hash";
import { sendEmail } from "src/common/utils/sendEmail";
import { UserRepositoryService } from "src/DB/Repository/index";



@Injectable()
export class UserService {

    constructor(
        private readonly userRepository: UserRepositoryService,
        private readonly TokenService: TokenService,
        private readonly hashService: HashingService
    ) { }


    async signIn(data: loginDto): Promise<{ token: string }> {

        const { email, pass } = data
        if (!email || !pass) {
            throw new ConflictException('Email and password are required');
        }

        const user = await this.userRepository.findOne({ email: email, confirmed: true });
        if (!user) {
            throw new ConflictException('User Not Found Or Not confirmed yet');
        }

        if (!this.hashService.CompareHash(pass, user.pass)) {
            throw new ConflictException('Invalid email or password');
        }

        const token = this.TokenService.generateToken({ email: user.email, userId: user['_id'] }, { secret: process.env.JWT_SECRET, expiresIn: '7d' });
        return { token };
    }

    async signUp(body: UserDto): Promise<object> {
        const { name, email, DOB, gender, phone, address, pass } = body
        const userExist = await this.userRepository.findOne({ email })
        if (userExist) {
            throw new ConflictException("User already exists");
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpire = new Date(Date.now() + 1000 * 60 * 10)

        const newUser = await this.userRepository.create({
            name,
            email,
            DOB,
            gender,
            phone,
            pass,
            address,
            otp: [{
                otp: await this.hashService.Hash(otp.toString()),
                expire: otpExpire,
                type: 'Confirm'
            }]
        })

        await sendEmail({
            to: email,
            subject: 'Confirm your email',
            html: `${otp}`,
        });
        return { message: 'done', newUser };
    }

    async ConfirmEmailService(body: ConfirmDto): Promise<object> {
        const { email, otp } = body;
        if (!email || !otp)
            throw new BadRequestException('Email and code are required');
        const findUser = await this.userRepository.findOne({
            email,
            confirmed: false,
        });
        if (!findUser)
            throw new NotFoundException('User not found or already confirmed');

        const findOtp = findUser.otp.find((item) => item.type === 'Confirm');
        if (
            !findOtp ||
            !(
                (await this.hashService.CompareHash(otp, findOtp.otp)) ||
                findOtp.expire < new Date()
            )
        ) {
            throw new BadRequestException('Invalid code');
        }

        await this.userRepository.findOneAndUpdate(
            {
                email,
            },
            {
                confirmed: true,
                $unset: {
                    otp: '',
                },
            },
        );
        return { message: 'done' };
    }
}