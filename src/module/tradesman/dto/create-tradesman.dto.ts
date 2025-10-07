import {
  IsString,
  IsOptional,
  IsEmail,
  IsDateString,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { CreateDocsDto } from './docs.dto';
import { CreateBusinessDetailDto } from './business-detail.dto';
import { CreateServiceAreaDto } from './service-area.dto';
import { CreateDocsDto } from './docs.dto';
import { CreatePaymentMethodDto } from './payment-method.dto';
// import { CreatePaymentMethodDto } from './payment-method.dto';

export class CreateTradesManDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+8801712345678' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ example: '1995-08-12' })
  @IsDateString()
  dateOfBirth: string;

  @ApiPropertyOptional({ example: '123 Main Street' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'NID' })
  @IsString()
  docType?: string;

  @ApiPropertyOptional({ example: 'Dhaka' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Dhaka Division' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: 1206 })
  @IsOptional()
  zipCode?: number;

  @ApiPropertyOptional({ type: () => CreateDocsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateDocsDto)
  docs?: CreateDocsDto;

  @ApiPropertyOptional({ type: () => CreateBusinessDetailDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateBusinessDetailDto)
  businessDetail?: CreateBusinessDetailDto;

  @ApiPropertyOptional({ type: () => CreateServiceAreaDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateServiceAreaDto)
  serviceArea?: CreateServiceAreaDto;

  @ApiPropertyOptional({ type: () => CreatePaymentMethodDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePaymentMethodDto)
  paymentMethod?: CreatePaymentMethodDto;

  @IsOptional()
  @IsString()
  professionalQualifications?: string;

  @IsOptional()
  @IsString()
  credential?: string;
}
