import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  Length,
  IsArray,
  ArrayMaxSize,
  ValidateIf,
} from 'class-validator';

export class UpdateTradesManDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  @Length(2, 50)
  fullName?: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+8801789456123' })
  @IsString()
  @IsOptional()
  @Length(10, 15)
  phone?: string;

  @ApiProperty({ example: 'Electrician' })
  @IsString()
  @IsOptional()
  profession?: string;

  @ApiProperty({ example: 'Experienced tradesman with 5 years of field work.' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ example: '123 Main Street' })
  @IsString()
  street: string;

  @ApiProperty({ example: 'Dhaka' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Dhaka Division' })
  @IsString()
  state: string;

  @ApiProperty({ example: 1207 })
  @IsOptional()
  @Type(() => Number) // ✅ converts string to number
  @IsNumber()
  zipCode?: number;

  @ApiProperty({
    description: 'Upload up to 5 images',
    type: 'string',
    format: 'binary',
    isArray: true,
    required: false,
  })
  @IsOptional()
  // @ValidateIf((_, value) => value !== undefined && value !== null)
  @IsArray({ message: 'images must be an array' })
  @ArrayMaxSize(5, { message: 'You can upload up to 5 images only' })
  images?: Express.Multer.File[];
}
