import { IsOptional, IsString, IsNumber, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetJobsFilterDto {
  
  @ApiProperty({
    description: 'Search term for job title or description.',
    required: false,
    example: 'Clean house',
  })
  @IsOptional()
  @IsString()
  readonly search?: string;

  @ApiProperty({
    description: 'Filter by a single Category name or ID.',
    required: false,
    example: 'Clean bath',
  })
  @IsOptional()
  @IsString()
  readonly category?: string;

  @ApiProperty({
    description: 'Filter by a single SubCategory name or ID.',
    required: false,
    example: 'clean',
  })
  @IsOptional()
  @IsString()
  readonly subCategory?: string;

  @ApiProperty({
    description: 'Filter by job location (e.g., city or state).',
    required: false,
    example: 'New York',
  })
  @IsOptional()
  @IsString()
  readonly location?: string;

  @ApiProperty({
    description: 'Minimum price for price range filter.',
    required: false,
    type: Number,
    minimum: 0,
    example: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  readonly minPrice?: number;

  @ApiProperty({
    description: 'Maximum price for price range filter.',
    required: false,
    type: Number,
    minimum: 1, 
    example: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  readonly maxPrice?: number;
}