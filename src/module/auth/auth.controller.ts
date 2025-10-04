import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBody } from '@nestjs/swagger';
import {SendOtpDTO } from './dto/otp.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('singup')
  @ApiBody({ type: CreateAuthDto })
  async signUp(@Body() createAuthDto: CreateAuthDto) {
    try{
      const res = await this.authService.signUp(createAuthDto);
    return {
      message: 'User created successfully',
      data: res,
    };
    }catch(err){
      return {
        message: err.message,
        error: err,
      };
    }
  }

  @Post('phone_otp')
  @Public()
  @ApiBody({type:SendOtpDTO})
  async sendOtp(@Body() otpDto: SendOtpDTO) {
    return this.authService.send_otp(otpDto);
  }
  
  @Post('login')
  @Public()
  async login() {
    return this.authService.login();
  }
}
