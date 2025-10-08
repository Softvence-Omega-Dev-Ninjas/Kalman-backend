// create-category.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
//   @IsString({ each: true })
  @IsOptional()
  subCategories?: string[];
}
