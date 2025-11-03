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
  ValidateNested,
} from 'class-validator';

class PortfolioImage {
  @ApiProperty({ example: 0 })
  @IsNumber()
  index: number;

  @ApiProperty({ example: 'Expert' })
  @IsString()
  url: string;
}
export class UpdateTradesManDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsOptional()
  @Length(2, 50)
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsOptional()
  @Length(2, 50)
  lastName?: string;



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

  @ApiProperty({ example: 'Dhaka Division', required: false })
  @IsString()
  @IsOptional()
  profileImage: string;

  @ApiProperty({ example: 1207 })
  @IsOptional()
  @Type(() => Number) // ✅ converts string to number
  @IsNumber()
  zipCode?: number;



  @ApiProperty({ example: 'John' })
  @IsString()
  name: string;

  @ApiProperty({
    type: [PortfolioImage],
    description: 'Array of skill objects',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PortfolioImage)
  images: PortfolioImage[];
}

export class UpdateTradesmanProfileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  image: Express.Multer.File;
}
