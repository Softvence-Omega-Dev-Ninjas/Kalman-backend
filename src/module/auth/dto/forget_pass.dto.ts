import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import Api from 'twilio/lib/rest/Api';

export class ForgetPassDto {
  @ApiProperty({
    example: 'milon@gmail.com',
    description: 'The email address of the user',
  })
  @IsString()
  @IsEmail()
  email: string;
}

export class UpdatePassDto {
  @ApiProperty({
    example: 'milon@gmail.com',
    description: 'The email address of the user',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'The new password for the user',
  })
  @IsString()
  password: string;
}
