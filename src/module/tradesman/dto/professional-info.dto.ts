import { IsString, IsOptional, IsInt, IsArray } from 'class-validator';

export class CreateProfessionalInfoDto {
  @IsOptional()
  @IsInt()
  yearsOfExperience?: number;

  @IsOptional()
  @IsString()
  businessType?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];

  @IsOptional()
  @IsString()
  professionalDescription?: string;
}
