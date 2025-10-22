import {
  IsOptional,
  IsString,
  IsPhoneNumber,
  IsEnum,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Define the fields you want to allow for update, making them optional

export class UpdateCustomerDto {
  @ApiProperty({ required: false, example: 'Jane Doe' })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ required: false, example: '+8801700000000' })
  @IsOptional()
  @IsString()
  readonly phone?: string;

  @ApiProperty({
    required: false,
    readOnly: true,
    description: 'The URL or path to the saved image.',
  })
  @IsOptional()
  @IsString()
  readonly profile_image?: string;

  @ApiProperty({ required: false, example: 'Electrician' })
  @IsOptional()
  @IsString()
  readonly profession?: string;

  @ApiProperty({
    required: false,
    example: 'Experienced wireman specializing in commercial buildings.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  readonly bio?: string;

  @ApiProperty({ required: false, example: '123 Main St' })
  @IsOptional()
  @IsString()
  readonly street_address?: string;

  @ApiProperty({ required: false, example: 'Dhaka' })
  @IsOptional()
  @IsString()
  readonly city?: string;

  @ApiProperty({ required: false, example: 'California' })
  @IsOptional()
  @IsString()
  readonly state?: string;

  @ApiProperty({ required: false, example: '90210' })
  @IsOptional()
  @IsString()
  readonly zip_code?: string;
  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  readonly is_deleted?: boolean;
}
