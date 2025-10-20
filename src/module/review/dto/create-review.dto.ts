import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Nice work' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ example: 'fbfgn sgvdfdfbdf ged' })
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ example: 'fbfgn sgvdfdfbdf ged' })
  //   @IsUUID()
  @IsNotEmpty()
  tradesManId: string;
}
