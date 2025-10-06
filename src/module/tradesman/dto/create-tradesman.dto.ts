import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsDateString,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { CreateProfessionalInfoDto } from './professional-info.dto';
import { CreateBusinessDetailDto } from './business-detail.dto';
import { CreateServiceAreaDto } from './service-area.dto';

export class CreateTradesManDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsDateString()
  dateOfBirth: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsString()
  userId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProfessionalInfoDto)
  professionalInfo?: CreateProfessionalInfoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateBusinessDetailDto)
  businessDetail?: CreateBusinessDetailDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateServiceAreaDto)
  serviceArea?: CreateServiceAreaDto;
}
