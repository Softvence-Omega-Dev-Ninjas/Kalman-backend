import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class GetAllUserDto {

  @ApiProperty({
    description: 'The search query for filtering users.',
    required: false,
    type: String,
    default: '',
  })
  @IsString()
  @IsOptional()
  search?: string;
  
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
