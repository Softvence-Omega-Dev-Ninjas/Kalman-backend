import { IsNumber, IsOptional } from 'class-validator';

export class CreateServiceAreaDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsNumber()
  radius?: number;
}
