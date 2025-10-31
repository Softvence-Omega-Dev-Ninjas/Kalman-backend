// src/jobs/dto/get-jobs-filter.dto.ts
import { IsOptional, IsString, IsNumber, Min, IsArray } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetTradesmanFilterDto {
  @ApiProperty({
    description: 'Search term for job title or description.',
    required: false,
    example: 'Clean house',
  })
  @IsOptional()
  @IsString()
  readonly search?: string;

  @ApiProperty({
    description: 'Filter by one or multiple Category IDs.',
    required: false,
    example: ['cat_123', 'cat_456'],
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((v) => v.trim());
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  readonly category?: string[];

  @ApiProperty({
    description: 'Filter by one or multiple SubCategory names or IDs.',
    required: false,
    example: ['roofing', 'waterproofing'],
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((v) => v.trim());
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  readonly subCategory?: string[];

  @ApiProperty({
    description: 'Filter by job location (e.g., city or state).',
    required: false,
    example: 'New York',
  })
  @IsOptional()
  @IsString()
  readonly location?: string;

  @ApiProperty({
    description: 'Filter by rating .',
    required: false,
    type: [Number],
    example: 4,
  })
  @IsArray()
  @Transform(
    ({ value }) => (Array.isArray(value) ? value.map(Number) : [Number(value)]), // handle single values like ?rating=4
  )
  @IsNumber({}, { each: true })
  rating: number[];

  @ApiProperty({
    description: 'The current page number (1-based).',
    required: false,
    type: Number,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  readonly page?: number = 1;

  @ApiProperty({
    description: 'The number of items per page.',
    required: false,
    type: Number,
    default: 10,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  readonly limit?: number = 10;
}
