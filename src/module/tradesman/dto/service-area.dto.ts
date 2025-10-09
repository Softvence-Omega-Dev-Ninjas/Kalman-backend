import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceAreaDto {
  @ApiProperty({ example: '123 Main Street' })
  @IsString()
  address: string;

  @ApiProperty({ example: 23.7808875 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 90.2792371 })
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  radius?: number;
}
