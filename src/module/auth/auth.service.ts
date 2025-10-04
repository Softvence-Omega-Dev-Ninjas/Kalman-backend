import { HttpException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SendOtpDTO } from './dto/otp.dto';
import { TwilioService } from '../twilio/twilio.service';
import { MailService } from '../mail/mail.service';
import { OtpTemplateService } from '../mail/templates/otp.templates';
import { Status } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ResetPassworDto } from './dto/reset_pass.dto';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private twilio: TwilioService,
    private mail: MailService,
    private otpTemplate: OtpTemplateService,
    private jwtService: JwtService,
  ) {}
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
      throw new HttpException('Email already exist', 400);
    }
    if (isPhoneExist) {
      throw new HttpException('Phone already exist', 400);
    }
    const hash_password = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: email,
        Phone: phone,
        password: hash_password,
      },
    });
    return user;
  }

  async send_otp(otpDto: SendOtpDTO) {
    const { phone } = otpDto;
    await this.twilio.sendOtp(phone, '1234');
  }





  // login user by email and password
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new HttpException('User not found', 400);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpException('Password not matched', 400);
    }
    const payload = {
      email: user.email,
      id: user.id,
      phone: user.Phone,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
    });
    return token;
  }




  // send 6 digit otp by email
  async send_verification_otp_by_email(otpDto: SendOtpDTO) {
    const randomNumber = Math.floor(Math.random() * 900000) + 100000;
    const html = this.otpTemplate.generateOtpHtml({
      otp: randomNumber,
    });
    const isExistUser = await this.prisma.user.findFirst({
      where: {
        email: otpDto.email,
      },
    });
    if (!isExistUser) {
      throw new HttpException('User not found', 400);
    }
    const [] = await Promise.all([
      await this.mail.sendMail({
        to: otpDto.email,
        subject: 'OTP',
        html: html,
      }),
      await this.prisma.user.updateMany({
        where: {
          email: otpDto.email,
        },
        data: {
          otp: randomNumber,
        },
      }),
    ]);
    return {
      message: 'OTP sent successfully',
      randomNumber,
    };
  }




  // verfiy all email otp from this service
  async verify_otp_by_email(otp: number) {
    const isExistUser = await this.prisma.user.findFirst({
      where: {
        otp: otp,
      },
    });

    if (!isExistUser || isExistUser.otp != otp) {
      throw new HttpException('OTP not matched', 400);
    }
    await this.prisma.user.updateMany({
      where: {
        otp: otp,
      },
      data: {
        verification: Status.COMPLETE,
        otp: null,
      },
    });
    return {
      message: 'OTP verified successfully',
    };
  }



  // reset password by email
  async reset_password(resetPassDto:ResetPassworDto,user:any) {
    const { old_password,new_password } = resetPassDto;
    const {email}=user;
    const isExistUser = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!isExistUser) {
      throw new HttpException('User not found', 400);
    }
    const isMatch = await bcrypt.compare(old_password, isExistUser.password);
    if (!isMatch) {
      throw new HttpException('your old password is not matched', 400);
    }
    const hash_password = await bcrypt.hash(new_password, 10);
    await this.prisma.user.updateMany({
      where: {
        email: email,
      },
      data: {
        password: hash_password,
      },
    });
    return {
      message: 'Password reset successfully',
    };
  }
}
