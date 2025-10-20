import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class SystemActivityDto {
  @ApiProperty({
    description: 'Maximum login attempt allowed before suspension',
    example: 5,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  maximum_attempt: number;

  @ApiProperty({
    description: 'Session timeout duration (in minutes)',
    example: 5,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  session_timeout: number;

  @ApiProperty({
    description: 'Maintenance mode enabled or disabled',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  maintenance_mode: boolean;

  @ApiProperty({
    description: 'Allow or disallow new user registration',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  new_registration: boolean;
}
