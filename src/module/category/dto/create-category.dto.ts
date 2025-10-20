import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Sample Item' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: ['tag1', 'tag2'] })
  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  subCategories: string[];

  @ApiProperty({
    description: 'Image file URL or base64 string',
    type: 'string',
    format: 'binary',
  })
  @IsString()
  @IsOptional()
  image: string;
}
