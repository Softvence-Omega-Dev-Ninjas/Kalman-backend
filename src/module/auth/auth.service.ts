import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
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

  // sing up logic
  async signUp(createAuthDto: CreateAuthDto) {
    const { email, password } = createAuthDto;

    const activity_table = await this.prisma.admin_activity.findFirst();
    if (activity_table?.new_registration) {
      throw new HttpException(
        'The system under the observation,please try again letter..........',
        400,
      );
    }
    // check the user validation
    const [isEmailExist] = await Promise.all([
      this.prisma.user.findFirst({
        where: {
          email: email,
        },
      }),
    ]);
    if (isEmailExist) {
      throw new HttpException('Email already exist', HttpStatus.BAD_REQUEST);
    }
    const hash_password = await bcrypt.hash(password, 10);
    if (createAuthDto.role === 'ADMIN') {
      throw new HttpException('You are not allowed to create admin', 400);
    }
    const user = await this.prisma.user.create({
      data: {
        email: email,
        password: hash_password,
        role: createAuthDto.role,
      },
    });
    return user;
  }

  // send otp by phone

  // login user by email and password
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const current_time = new Date();
    const activity = await this.prisma.admin_activity.findFirst();
    const maxAtm = activity?.maximum_attempt;
    const sesssion = activity?.session_timeout;
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new HttpException('User not found', 400);
    }

    if (user.suspenstion_time && current_time > user.suspenstion_time) {
      await this.prisma.user.updateMany({
        where: { email },
        data: { suspenstion_time: null, max_login_attampt: 0 },
      });
      user.suspenstion_time = null;
      user.max_login_attampt = 0;
    }

    if (user.suspenstion_time && current_time < user.suspenstion_time) {
      throw new HttpException(`You are suspended for ${sesssion} minutes`, 400);
    }

    if (user.verification !== Status.COMPLETE) {
      throw new HttpException('You are not verified', 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const newAttempt = (user.max_login_attampt ?? 0) + 1;

      if (newAttempt >= maxAtm!) {
        await this.prisma.user.updateMany({
          where: { email },
          data: {
            suspenstion_time: new Date(Date.now() + sesssion! * 60 * 1000),
            max_login_attampt: newAttempt,
          },
        });
        throw new HttpException(
          `You have reached maximum login attempts. Try again after ${sesssion} minutes.`,
          400,
        );
      }

      await this.prisma.user.updateMany({
        where: { email },
        data: { max_login_attampt: newAttempt },
      });

      throw new HttpException('Password not matched', 400);
    }

    // Successful login -> reset attempts
    await this.prisma.user.updateMany({
      where: { email },
      data: { max_login_attampt: 0, suspenstion_time: null },
    });

    const payload = {
      email: user.email,
      id: user.id,
      phone: user.phone,
      role: user.role,
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
  async reset_password(resetPassDto: ResetPassworDto, user: any) {
    const { old_password, new_password } = resetPassDto;
    const { email } = user;
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

  // admin login this route will use just for admin
  async adminLogin(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const current_time = new Date();

    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new HttpException('User not found', 400);
    }

    if (user.suspenstion_time && current_time > user.suspenstion_time) {
      await this.prisma.user.updateMany({
        where: { email },
        data: { suspenstion_time: null, max_login_attampt: 0 },
      });
      user.suspenstion_time = null;
      user.max_login_attampt = 0;
    }

    if (user.suspenstion_time && current_time < user.suspenstion_time) {
      throw new HttpException('You are suspended for 2 minutes', 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const newAttempt = (user.max_login_attampt ?? 0) + 1;

      if (newAttempt >= 5) {
        await this.prisma.user.updateMany({
          where: { email },
          data: {
            suspenstion_time: new Date(Date.now() + 2 * 60 * 1000), // suspend the user with fixed amount time
            max_login_attampt: newAttempt,
          },
        });
        throw new HttpException(
          'You have reached maximum login attempts. Try again after 2 minutes.',
          400,
        );
      }

      await this.prisma.user.updateMany({
        where: { email },
        data: { max_login_attampt: newAttempt },
      });

      throw new HttpException('Password not matched', 400);
    }

    // Successful login -> reset attempts
    await this.prisma.user.updateMany({
      where: { email },
      data: { max_login_attampt: 0, suspenstion_time: null },
    });

    const payload = {
      email: user.email,
      id: user.id,
      phone: user.phone,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
    });

    return token;
  }
}
