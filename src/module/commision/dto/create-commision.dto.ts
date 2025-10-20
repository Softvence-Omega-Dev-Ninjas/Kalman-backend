import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateCommisionDto {
  @ApiProperty({
    description: 'The commission rate for the tradesman.',
    type: Number,
    example: 0.1,
  })
  @IsNumber()
  commisssion_rate: number;
  @ApiProperty({
    description: 'The minimum hourly rate for the tradesman.',
    type: Number,
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  minimun_hourly_rate: number;
  @ApiProperty({
    description: 'The maximum hourly rate for the tradesman.',
    type: Number,
    example: 100,
  })
  @IsNumber()
  @IsOptional()
  maximum_hourly_rate: number;
}
