import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateBusinessDetailDto {
  @IsOptional()
  @IsString()
  businessName?: string;

  @IsOptional()
  @IsEmail()
  businessEmail?: string;

  @IsOptional()
  @IsString()
  businessLicense?: string;

  @IsOptional()
  @IsString()
  verifyIdentity?: string; // URL or file path
}
