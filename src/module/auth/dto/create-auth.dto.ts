import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    description: 'Here will go user email',
    example: 'milon@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Here will go user phone',
    example: '01700000000',
  })
  phone: string;

  @ApiProperty({
    description: 'Here will go user password',
    example: '123456',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Here will role',
    example: Role.CUSTOMER,
  })
  @IsOptional()
  @IsNotEmpty()
  role: Role
}
