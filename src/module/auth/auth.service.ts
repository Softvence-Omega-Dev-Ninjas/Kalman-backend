import { HttpException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SendOtpDTO } from './dto/otp.dto';
import { TwilioService } from '../twilio/twilio.service';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService,private twilio:TwilioService) {}
  async signUp(createAuthDto: CreateAuthDto) {
    const { email, phone, password } = createAuthDto;

    // check the user validation
    const [isEmailExist, isPhoneExist] = await Promise.all([
      this.prisma.user.findFirst({
        where: {
          email: email,
        },
      }),
      this.prisma.user.findFirst({
        where: {
          Phone: phone,
        },
      }),
    ]);
    if (isEmailExist) {
      throw new HttpException('Email already exist', 400)
    }
    if (isPhoneExist) {
     throw new HttpException('Phone already exist', 400)
    }
    const hash_password= await bcrypt.hash(password,10)
  
    const user = await this.prisma.user.create({
      data: {
        email: email,
        Phone: phone,
        password: hash_password,
      },
    });
    return user;
  }

 async send_otp(otpDto:SendOtpDTO) {
    const {phone}=otpDto
    await this.twilio.sendOtp(phone,'1234')
  }
  async login() {
    return `This action returns all auth`;
  }
 
}
