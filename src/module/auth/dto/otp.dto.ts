import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class SendOtpDTO {
  @ApiProperty({
    description: 'Here will go user email',
    example: 'milon@gmail.com',
  })
  @IsNotEmpty()
  @IsOptional()
  email: string;
}
