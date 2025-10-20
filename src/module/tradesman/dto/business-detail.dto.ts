import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBusinessDetailDto {
  @ApiPropertyOptional({ example: 'John Plumbing Services' })
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiProperty({ example: 5.5 })
  @IsNumber()
  yearsOfExperience: number;

  @ApiPropertyOptional({ example: 'Individual Contractor' })
  @IsOptional()
  @IsString()
  businessType?: string;

  @ApiPropertyOptional({ example: '$50/hr' })
  @IsOptional()
  @IsString()
  hourlyRate?: string;

  @ApiProperty({
    example: ['Plumbing', 'Electrical'],
    type: [String],
  })
  @IsArray()
  services: string[];

  @ApiPropertyOptional({
    example: 'Experienced professional specializing in residential plumbing.',
  })
  @IsOptional()
  @IsString()
  professionalDescription?: string;
}
