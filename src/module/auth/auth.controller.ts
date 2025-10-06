import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBody } from '@nestjs/swagger';
import { SendOtpDTO } from './dto/otp.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPassworDto } from './dto/reset_pass.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // signUp route
  @Public()
  @Post('singup')
  @ApiBody({ type: CreateAuthDto })
  async signUp(@Body() createAuthDto: CreateAuthDto) {
    try {
      const res = await this.authService.signUp(createAuthDto);
      return {
        message: 'User created successfully',
        data: res,
      };
    } catch (err) {
      return {
        message: err.message,
        error: err,
      };
    }
  }

  // login route
  @Post('login')
  @Public()
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    const res = await this.authService.login(loginDto);
    return {
      message: 'User logged in successfully',
      status: 200,
      data: res,
    };
  }

  // phone otp route
  @Post('phone_otp')
  @Public()
  @ApiBody({ type: SendOtpDTO })
  async sendOtp(@Body() otpDto: SendOtpDTO) {
    return this.authService.send_otp(otpDto);
  }

  // email otp route
  @Post('send_otp_by_email')
  @Public()
  @ApiBody({ type: SendOtpDTO })
  async sendOtpByEmail(@Body() otpDto: SendOtpDTO) {
    return this.authService.send_verification_otp_by_email(otpDto);
  }

  // verrify otp route of email otp
  @Post('verify-otp')
  @Public()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        otp: {
          type: 'number',
          example: 123456,
        },
      },
    },
  })
  async verifyOtp(@Body() boyd: { otp: number }) {
    return this.authService.verify_otp_by_email(boyd.otp);
  }

  // reset password route
  @Post('reset-password')
  @ApiBody({ type: ResetPassworDto })
  async resetPassword(@Body() resetPassDto: ResetPassworDto, @Req() req: any) {
    const user = req.user;
    return this.authService.reset_password(resetPassDto, user);
  }
}
