import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPassworDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'give your Old Pass here',
    example: '123456',
  })
  old_password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'give your New Pass here',
    example: '123456',
  })
  new_password: string;
}
