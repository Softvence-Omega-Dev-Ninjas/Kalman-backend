import {
  IsString,
  IsOptional,
  IsBoolean,
  Matches,
  IsIn,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentMethodDto {
  @ApiProperty({
    example: 'Credit/Debit Card',
    enum: ['Credit/Debit Card', 'Mobile Banking'],
  })
  @IsIn(['Credit/Debit Card', 'Mobile Banking'])
  methodType: string;

  @ApiPropertyOptional({ example: 'Visa' })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  cardHolderName?: string;

  @ApiPropertyOptional({ example: '1234567890123456' })
  @IsOptional()
  @Matches(/^\d{16}$/, { message: 'Card number must be 16 digits' })
  cardNumber?: string;

  @ApiPropertyOptional({ example: '12/25' })
  @IsOptional()
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, {
    message: 'Invalid expiry date format (MM/YY)',
  })
  expiryDate?: string;

  @ApiPropertyOptional({ example: '123' })
  @IsOptional()
  @Matches(/^\d{3}$/, { message: 'CVV must be 3 digits' })
  cvv?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  saveCard?: boolean;

  @ApiPropertyOptional({ example: '123 Main Street' })
  @IsOptional()
  @IsString()
  streetAddress?: string;

  @ApiPropertyOptional({ example: 'Dhaka' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: '1207' })
  @IsOptional()
  @IsString()
  postCode?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  agreedToTerms: boolean;
}
