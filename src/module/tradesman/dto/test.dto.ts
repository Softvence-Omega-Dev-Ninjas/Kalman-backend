import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  ValidateNested,
  IsArray,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 🔹 Nested DTOs
 */

// --- Docs DTO ---
export class CreateDocsDto {
  @ApiProperty({ example: 'NID', description: 'Type of document uploaded' })
  @IsString()
  @IsNotEmpty()
  type: string;
}

// --- Business Detail DTO ---
export class CreateBusinessDetailDto {
  @ApiProperty({ example: 'FixPro Ltd.' })
  @IsString()
  businessName: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  yearsOfExperience: number;

  @ApiProperty({ example: 'Plumbing' })
  @IsString()
  businessType: string;

  @ApiProperty({ example: '25/hr' })
  @IsString()
  hourlyRate: string;

  @ApiProperty({
    type: [String],
    example: ['Leak repair', 'Pipe installation'],
  })
  @IsArray()
  @IsString({ each: true })
  services: string[];

  @ApiProperty({ example: 'Experienced professional plumber' })
  @IsString()
  professionalDescription: string;
}

// --- Service Area DTO ---
export class CreateServiceAreaDto {
  @ApiProperty({ example: 'Uttara, Dhaka' })
  @IsString()
  address: string;

  @ApiProperty({ example: 23.8756 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 90.3794 })
  @IsNumber()
  longitude: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  radius: number;
}

// --- Payment Method DTO ---
export class CreatePaymentMethodDto {
  @ApiProperty({ example: 'Card' })
  @IsString()
  methodType: string;

  @ApiProperty({ example: 'Visa' })
  @IsString()
  provider: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  cardHolderName: string;

  @ApiProperty({ example: '4111111111111111' })
  @IsString()
  cardNumber: string;

  @ApiProperty({ example: '12/25' })
  @IsString()
  expiryDate: string;

  @ApiProperty({ example: '123' })
  @IsString()
  cvv: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  saveCard: boolean;

  @ApiProperty({ example: '123 Main Street' })
  @IsString()
  streetAddress: string;

  @ApiProperty({ example: 'Dhaka' })
  @IsString()
  city: string;

  @ApiProperty({ example: '1206' })
  @IsString()
  postCode: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  agreedToTerms: boolean;
}

/**
 * 🔹 Main Tradesman DTO
 */
export class CreateTradesManDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'category_123' })
  @IsString()
  categoryId: string;

  @ApiProperty({
    type: [String],
    example: ['Tag 1', 'Tag 2'],
    description: 'Sub-categories of tradesman',
  })
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map((v) => v.trim()) : value,
  )
  subCategories: string[];

  @ApiProperty({ example: '+8801712345678' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ example: '1995-08-12' })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ example: '123 Main Street' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Dhaka' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'Dhaka Division' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: 1206 })
  @IsOptional()
  @IsNumber()
  zipCode?: number;

  // 🔹 File fields (handled by interceptor)
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Document file',
  })
  doc?: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Credential file',
  })
  credential?: any;

  // 🔹 Nested objects
  @ApiProperty({ type: () => CreateDocsDto })
  @ValidateNested()
  @Type(() => CreateDocsDto)
  docs: CreateDocsDto;

  @ApiProperty({ type: () => CreateBusinessDetailDto })
  @ValidateNested()
  @Type(() => CreateBusinessDetailDto)
  businessDetail: CreateBusinessDetailDto;

  @ApiProperty({ type: () => CreateServiceAreaDto })
  @ValidateNested()
  @Type(() => CreateServiceAreaDto)
  serviceArea: CreateServiceAreaDto;

  @ApiProperty({ type: () => CreatePaymentMethodDto })
  @ValidateNested()
  @Type(() => CreatePaymentMethodDto)
  paymentMethod: CreatePaymentMethodDto;

  @ApiProperty({ example: 'Certified Electrician' })
  @IsOptional()
  @IsString()
  professionalQualifications?: string;
}
